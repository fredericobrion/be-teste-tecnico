import { test } from '@japa/runner'
import SaleService from '../../../app/services/sale_service.js'
import SalesController from '../../../app/controllers/sales_controller.js'
import { ServiceResponse } from '../../../app/types/service_response.js'
import { HttpContext } from '@adonisjs/core/http'
import { SaleCreated } from '../../../app/dto/sale_dto.js'
import { DateTime } from 'luxon'
import FormatTransformer from '../../../app/utils/format_transformer.js'

test.group('Sales controller', () => {
  test('product not found when creating sale', async ({ assert }) => {
    class FakeService extends SaleService {
      async createSale(
        _clientId: number,
        _productId: number,
        _quantity: number,
        _createdAt: Date | undefined
      ): Promise<ServiceResponse<SaleCreated>> {
        return { status: 'NOT_FOUND', data: { error: 'Product not found' } }
      }
    }

    const controller = new SalesController()

    const response = await controller.store(
      {
        request: {
          validateUsing: async () => ({ productId: 1, quantity: 1, createdAt: new Date() }),
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
        params: { clientId: 1 },
      } as unknown as HttpContext,
      new FakeService()
    )

    assert.propertyVal(response, 'status', 404)
    assert.deepPropertyVal(response, 'data', { error: 'Product not found' })
  })

  test('client not found when creating sale', async ({ assert }) => {
    class FakeService extends SaleService {
      async createSale(
        _clientId: number,
        _productId: number,
        _quantity: number,
        _createdAt: Date | undefined
      ): Promise<ServiceResponse<SaleCreated>> {
        return { status: 'NOT_FOUND', data: { error: 'Client not found' } }
      }
    }

    const controller = new SalesController()

    const response = await controller.store(
      {
        request: {
          validateUsing: async () => ({ productId: 1, quantity: 1, createdAt: new Date() }),
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
        params: { clientId: 1 },
      } as unknown as HttpContext,
      new FakeService()
    )

    assert.propertyVal(response, 'status', 404)
    assert.deepPropertyVal(response, 'data', { error: 'Client not found' })
  })

  test('creates a sale', async ({ assert }) => {
    const date = new Date('2024-03-15T12:00:00')

    class FakeService extends SaleService {
      async createSale(
        _clientId: number,
        _productId: number,
        _quantity: number,
        _createdAt: Date | undefined
      ): Promise<ServiceResponse<SaleCreated>> {
        return {
          status: 'CREATED',
          data: {
            id: 1,
            clientId: 1,
            productId: 1,
            quantity: 1,
            unitPrice: 10,
            totalPrice: 10,
            createdAt: FormatTransformer.formatDate(DateTime.fromISO(date.toISOString())),
          },
        }
      }
    }

    const controller = new SalesController()

    const response = await controller.store(
      {
        request: {
          validateUsing: async () => ({ productId: 1, quantity: 1, createdAt: new Date() }),
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
        params: { clientId: 1 },
      } as unknown as HttpContext,
      new FakeService()
    )

    assert.propertyVal(response, 'status', 201)
    assert.deepPropertyVal(response, 'data', {
      id: 1,
      clientId: 1,
      productId: 1,
      quantity: 1,
      unitPrice: 10,
      totalPrice: 10,
      createdAt: FormatTransformer.formatDate(DateTime.fromISO(date.toISOString())),
    })
  })
})
