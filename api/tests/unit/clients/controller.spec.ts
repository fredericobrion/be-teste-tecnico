import { test } from '@japa/runner'
import ClientService from '../../../app/services/client_service.js'
import ClientsController from '../../../app/controllers/clients_controller.js'
import { ServiceResponse } from '../../../app/types/service_response.js'
import { ClientCreatedDto, ClientWithSales } from '../../../app/dto/client_dto.js'
import { ClientFactory } from '../../../database/factories/client_factory.js'
import { HttpContext } from '@adonisjs/core/http'
import { AddressClientDto } from '../../../app/dto/address_dto.js'
import FormatTransformer from '../../../app/utils/format_transformer.js'
import { PhoneClientDto } from '../../../app/dto/phone_dto.js'
import { SalesClientDto } from '../../../app/dto/sale_dto.js'
import { DateTime } from 'luxon'

test.group('Clients controller', () => {
  test('cpf already registered', async ({ assert }) => {
    class FakeService extends ClientService {
      async createClient(): Promise<ServiceResponse<ClientCreatedDto>> {
        return {
          status: 'CONFLICT',
          data: { error: 'CPF already registered' },
        }
      }
    }

    const data = await ClientFactory.with('address').with('phone').makeStubbed()

    const controller = new ClientsController()

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
    assert.deepPropertyVal(response, 'data', { error: 'CPF already registered' })
  })

  test('email already registered', async ({ assert }) => {
    class FakeService extends ClientService {
      async createClient(): Promise<ServiceResponse<ClientCreatedDto>> {
        return {
          status: 'CONFLICT',
          data: { error: 'Email already registered' },
        }
      }
    }

    const data = await ClientFactory.with('address').with('phone').makeStubbed()

    const controller = new ClientsController()

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
    assert.deepPropertyVal(response, 'data', { error: 'Email already registered' })
  })

  test('create client', async ({ assert }) => {
    const mockedClient = await ClientFactory.with('address').with('phone').makeStubbed()

    const clientCreated = new ClientCreatedDto(
      mockedClient.id,
      mockedClient.name,
      mockedClient.email,
      mockedClient.cpf,
      mockedClient.address.id,
      mockedClient.phone.number
    )

    class FakeService extends ClientService {
      async createClient(): Promise<ServiceResponse<ClientCreatedDto>> {
        return {
          status: 'CREATED',
          data: clientCreated,
        }
      }
    }

    const controller = new ClientsController()

    const response = await controller.store(
      {
        request: {
          validateUsing: async () => mockedClient,
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
    assert.deepPropertyVal(response, 'data', clientCreated)
  })

  test('get all clients', async ({ assert }) => {
    const clients = await ClientFactory.with('address').with('phone').makeStubbedMany(3)

    const clientsCreated = clients.map((client) => {
      return new ClientCreatedDto(
        client.id,
        client.name,
        client.email,
        client.cpf,
        client.address.id,
        client.phone.number
      )
    })

    class FakeService extends ClientService {
      async getAllClients(): Promise<ServiceResponse<ClientCreatedDto[]>> {
        return {
          status: 'OK',
          data: clientsCreated,
        }
      }
    }

    const controller = new ClientsController()

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
    assert.deepPropertyVal(response, 'data', clientsCreated)
  })

  test('client not found when updating', async ({ assert }) => {
    class FakeService extends ClientService {
      async updateClient(_id: number): Promise<ServiceResponse<ClientCreatedDto>> {
        return {
          status: 'NOT_FOUND',
          data: { error: 'Client not found' },
        }
      }
    }

    const data = await ClientFactory.with('address').with('phone').makeStubbed()

    const controller = new ClientsController()

    const response = await controller.update(
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
        params: { id: 1 },
      } as unknown as HttpContext,
      new FakeService()
    )

    assert.propertyVal(response, 'status', 404)
    assert.deepPropertyVal(response, 'data', { error: 'Client not found' })
  })

  test('cpf already registered when updating', async ({ assert }) => {
    class FakeService extends ClientService {
      async updateClient(_id: number): Promise<ServiceResponse<ClientCreatedDto>> {
        return {
          status: 'CONFLICT',
          data: { error: 'CPF already registered' },
        }
      }
    }

    const data = await ClientFactory.with('address').with('phone').makeStubbed()

    const controller = new ClientsController()

    const response = await controller.update(
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
        params: { id: 1 },
      } as unknown as HttpContext,
      new FakeService()
    )

    assert.propertyVal(response, 'status', 409)
    assert.deepPropertyVal(response, 'data', { error: 'CPF already registered' })
  })

  test('email already registered when updating', async ({ assert }) => {
    class FakeService extends ClientService {
      async updateClient(_id: number): Promise<ServiceResponse<ClientCreatedDto>> {
        return {
          status: 'CONFLICT',
          data: { error: 'Email already registered' },
        }
      }
    }

    const data = await ClientFactory.with('address').with('phone').makeStubbed()

    const controller = new ClientsController()

    const response = await controller.update(
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
        params: { id: 1 },
      } as unknown as HttpContext,
      new FakeService()
    )

    assert.propertyVal(response, 'status', 409)
    assert.deepPropertyVal(response, 'data', { error: 'Email already registered' })
  })

  test('update client', async ({ assert }) => {
    const mockedClient = await ClientFactory.with('address').with('phone').makeStubbed()

    const clientUpdated = new ClientCreatedDto(
      mockedClient.id,
      mockedClient.name,
      mockedClient.email,
      mockedClient.cpf,
      mockedClient.address.id,
      mockedClient.phone.number
    )

    class FakeService extends ClientService {
      async updateClient(_id: number): Promise<ServiceResponse<ClientCreatedDto>> {
        return {
          status: 'OK',
          data: clientUpdated,
        }
      }
    }

    const controller = new ClientsController()

    const response = await controller.update(
      {
        request: {
          validateUsing: async () => mockedClient,
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
    assert.deepPropertyVal(response, 'data', clientUpdated)
  })

  test('client not found when searching by id', async ({ assert }) => {
    class FakeService extends ClientService {
      async updateClient(_id: number): Promise<ServiceResponse<ClientCreatedDto>> {
        return {
          status: 'NOT_FOUND',
          data: { error: 'Client not found' },
        }
      }
    }

    const controller = new ClientsController()

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
        request: {
          qs: () => {
            return {
              month: '01',
              year: '2022',
            }
          },
        } as any,
      } as unknown as HttpContext,
      new FakeService()
    )

    assert.propertyVal(response, 'status', 404)
    assert.deepPropertyVal(response, 'data', { error: 'Client not found' })
  })

  test('get client by id', async ({ assert }) => {
    const mockedClient = await ClientFactory.with('address')
      .with('phone')
      .with('sales')
      .makeStubbed()

    const clientAddress = new AddressClientDto(
      mockedClient.address.street,
      mockedClient.address.number,
      mockedClient.address.complement,
      mockedClient.address.neighborhood,
      mockedClient.address.city,
      mockedClient.address.uf,
      FormatTransformer.formatCep(mockedClient.address.cep)
    )

    mockedClient.sales[0].createdAt = DateTime.now()

    const clientPhone = new PhoneClientDto(
      mockedClient.phone.id,
      FormatTransformer.formatPhone(mockedClient.phone.number)
    )

    const clientSales = mockedClient.sales.map((sale) => {
      return new SalesClientDto(
        sale.id,
        sale.productId,
        Number(sale.quantity),
        Number(sale.unitPrice),
        Number(sale.totalPrice),
        FormatTransformer.formatDate(sale.createdAt)
      )
    })

    const clientWithSales = new ClientWithSales(
      mockedClient.id,
      mockedClient.name,
      mockedClient.email,
      FormatTransformer.formatCpf(mockedClient.cpf),
      clientAddress,
      clientPhone,
      clientSales
    )

    class FakeService extends ClientService {
      async getClientById(_id: number): Promise<ServiceResponse<ClientWithSales>> {
        return {
          status: 'OK',
          data: clientWithSales,
        }
      }
    }

    const controller = new ClientsController()

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
        request: {
          qs: () => {
            return {
              month: '01',
              year: '2022',
            }
          },
        } as any,
      } as unknown as HttpContext,
      new FakeService()
    )

    assert.propertyVal(response, 'status', 200)
    assert.deepPropertyVal(response, 'data', clientWithSales)
  })

  test('client not found when deleting', async ({ assert }) => {
    class FakeService extends ClientService {
      async deleteClient(_id: number): Promise<ServiceResponse<null | string>> {
        return {
          status: 'NOT_FOUND',
          data: { error: 'Client not found' },
        }
      }
    }

    const controller = new ClientsController()

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
    assert.deepPropertyVal(response, 'data', { error: 'Client not found' })
  })
})
