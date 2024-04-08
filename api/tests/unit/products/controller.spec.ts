import { test } from '@japa/runner'
import ProductService from '../../../app/services/product_service.js'
import ProductsController from '../../../app/controllers/products_controller.js'
import { ServiceResponse } from '../../../app/types/service_response.js'
import { HttpContext } from '@adonisjs/core/http'
import { ProductCreatedOrUpdated } from '../../../app/dto/product_dto.js'

test.group('Products controller', () => {
  test('product already exists', async ({ assert }) => {
    class FakeService extends ProductService {
      async createProduct(): Promise<ServiceResponse<ProductCreatedOrUpdated>> {
        return {
          status: 'CONFLICT',
          data: { error: 'Product already registered' },
        }
      }
    }

    const data = {
      name: 'product',
      description: 'description',
      price: 10,
    }

    const controller = new ProductsController()

    const response = await controller.store(
      {
        request: {
          validateUsing: async () => data,
        } as any,
        response: {
          status: (status: any) => {
            return {
              json: (responseData: any) => {
                return {
                  status,
                  data: responseData,
                }
              },
            }
          },
        },
      } as unknown as HttpContext,
      new FakeService()
    )

    assert.propertyVal(response, 'status', 409)
    assert.deepPropertyVal(response, 'data', { error: 'Product already registered' })
  })

  test('create product', async ({ assert }) => {
    const data = {
      id: 1,
      name: 'product',
      description: 'description',
      price: 10,
    }

    class FakeService extends ProductService {
      async createProduct(): Promise<ServiceResponse<ProductCreatedOrUpdated>> {
        return {
          status: 'CREATED',
          data,
        }
      }
    }

    const controller = new ProductsController()

    const response = await controller.store(
      {
        request: {
          validateUsing: async () => data,
        } as any,
        response: {
          status: (status: any) => {
            return {
              json: (responseData: any) => {
                return {
                  status,
                  data: responseData,
                }
              },
            }
          },
        },
      } as unknown as HttpContext,
      new FakeService()
    )

    assert.propertyVal(response, 'status', 201)
    assert.deepPropertyVal(response, 'data', data)
  })

  test('product not found when gettig by id', async ({ assert }) => {
    class FakeService extends ProductService {
      async getProductById(): Promise<ServiceResponse<ProductCreatedOrUpdated>> {
        return {
          status: 'NOT_FOUND',
          data: { error: 'Product not found' },
        }
      }
    }

    const controller = new ProductsController()

    const response = await controller.show(
      {
        response: {
          status: (status: any) => {
            return {
              json: (responseData: any) => {
                return {
                  status,
                  data: responseData,
                }
              },
            }
          },
        },
        params: { id: 1 },
      } as unknown as HttpContext,
      new FakeService()
    )

    assert.propertyVal(response, 'status', 404)
    assert.deepPropertyVal(response, 'data', { error: 'Product not found' })
  })

  test('get product by id', async ({ assert }) => {
    const data = {
      id: 1,
      name: 'product',
      description: 'description',
      price: 10,
    }

    class FakeService extends ProductService {
      async getProductById(): Promise<ServiceResponse<ProductCreatedOrUpdated>> {
        return {
          status: 'OK',
          data,
        }
      }
    }

    const controller = new ProductsController()

    const response = await controller.show(
      {
        response: {
          status: (status: any) => {
            return {
              json: (responseData: any) => {
                return {
                  status,
                  data: responseData,
                }
              },
            }
          },
        },
        params: { id: 1 },
      } as unknown as HttpContext,
      new FakeService()
    )

    assert.propertyVal(response, 'status', 200)
    assert.deepPropertyVal(response, 'data', data)
  })

  test('product not found when updating', async ({ assert }) => {
    class FakeService extends ProductService {
      async updateProduct(): Promise<ServiceResponse<ProductCreatedOrUpdated>> {
        return {
          status: 'NOT_FOUND',
          data: { error: 'Product not found' },
        }
      }
    }

    const controller = new ProductsController()

    const dataToUpdate = {
      name: 'new name',
    }

    const response = await controller.update(
      {
        request: {
          validateUsing: async () => dataToUpdate,
        } as any,
        response: {
          status: (status: any) => {
            return {
              json: (responseData: any) => {
                return {
                  status,
                  data: responseData,
                }
              },
            }
          },
        },
        params: { id: 1 },
      } as unknown as HttpContext,
      new FakeService()
    )

    assert.propertyVal(response, 'status', 404)
    assert.deepPropertyVal(response, 'data', { error: 'Product not found' })
  })

  test('update product', async ({ assert }) => {
    const data = {
      id: 1,
      name: 'new name',
      description: 'description',
      price: 10,
    }

    class FakeService extends ProductService {
      async updateProduct(_id: number): Promise<ServiceResponse<ProductCreatedOrUpdated>> {
        return {
          status: 'OK',
          data,
        }
      }
    }

    const controller = new ProductsController()

    const dataToUpdate = {
      name: 'new name',
    }

    const response = await controller.update(
      {
        request: {
          validateUsing: async () => dataToUpdate,
        } as any,
        response: {
          status: (status: any) => {
            return {
              json: (responseData: any) => {
                return {
                  status,
                  data: responseData,
                }
              },
            }
          },
        },
        params: { id: 1 },
      } as unknown as HttpContext,
      new FakeService()
    )

    assert.propertyVal(response, 'status', 200)
    assert.deepPropertyVal(response, 'data', data)
  })

  test('get all products', async ({ assert }) => {
    const data = [
      {
        id: 1,
        name: 'product',
        description: 'description',
        price: 10,
      },
    ]

    class FakeService extends ProductService {
      async getAllProducts(): Promise<ServiceResponse<ProductCreatedOrUpdated[]>> {
        return {
          status: 'OK',
          data,
        }
      }
    }

    const controller = new ProductsController()

    const response = await controller.index(
      {
        response: {
          status: (status: any) => {
            return {
              json: (responseData: any) => {
                return {
                  status,
                  data: responseData,
                }
              },
            }
          },
        },
      } as unknown as HttpContext,
      new FakeService()
    )

    assert.propertyVal(response, 'status', 200)
    assert.deepPropertyVal(response, 'data', data)
  })

  test('product not found when deleting', async ({ assert }) => {
    class FakeService extends ProductService {
      async deleteProduct(): Promise<ServiceResponse<null>> {
        return {
          status: 'NOT_FOUND',
          data: { error: 'Product not found' },
        }
      }
    }

    const controller = new ProductsController()

    const response = await controller.destroy(
      {
        response: {
          status: (status: any) => {
            return {
              json: (responseData: any) => {
                return {
                  status,
                  data: responseData,
                }
              },
            }
          },
        },
        params: { id: 1 },
      } as unknown as HttpContext,
      new FakeService()
    )

    assert.propertyVal(response, 'status', 404)
    assert.deepPropertyVal(response, 'data', { error: 'Product not found' })
  })
})
