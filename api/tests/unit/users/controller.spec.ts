import { test } from '@japa/runner'
import UserService from '../../../app/services/user_service.js'
import { UserCreatedDto, UserToCreate } from '../../../app/dto/user_dto.js'
import { ServiceResponse } from '../../../app/types/service_response.js'
import app from '@adonisjs/core/services/app'
import UsersController from '../../../app/controllers/users_controller.js'
import { HttpContext } from '@adonisjs/core/http'
import { AccessToken } from '@adonisjs/auth/access_tokens'

test.group('Users controller', () => {
  test('email already registered', async ({ assert }) => {
    class FakeService extends UserService {
      async createUser(_data: UserToCreate): Promise<ServiceResponse<UserCreatedDto>> {
        return {
          status: 'CONFLICT',
          data: { error: 'User already registered' },
        }
      }
    }

    app.container.swap(UserService, () => {
      return new FakeService()
    })

    const data = {
      name: 'maria',
      email: 'maria@email.com',
      password: '123456',
    }

    const controller = new UsersController()

    const response = await controller.signup(
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
    assert.deepPropertyVal(response, 'data', { error: 'User already registered' })
  })

  test('user created', async ({ assert }) => {
    const data = {
      id: 1,
      name: 'maria',
      email: 'maria@email.com',
      token: { token: 'token' } as unknown as AccessToken,
    }

    class FakeService extends UserService {
      async createUser(_data: UserToCreate): Promise<ServiceResponse<UserCreatedDto>> {
        return {
          status: 'CREATED',
          data,
        }
      }
    }

    app.container.swap(UserService, () => {
      return new FakeService()
    })

    const controller = new UsersController()

    const response = await controller.signup(
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

  test('login', async ({ assert }) => {
    const data = { token: 'token' } as unknown as AccessToken

    class FakeService extends UserService {
      async login(_email: string, _password: string): Promise<ServiceResponse<AccessToken>> {
        return {
          status: 'OK',
          data,
        }
      }
    }

    app.container.swap(UserService, () => {
      return new FakeService()
    })

    const controller = new UsersController()

    const response = await controller.login(
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

    assert.propertyVal(response, 'status', 200)
    assert.deepPropertyVal(response, 'data', data)
  })
})
