import { test } from '@japa/runner'
import UserService from '../../app/services/user_service.js'
import { AccessToken } from '@adonisjs/auth/access_tokens'
import { UserCreatedDto, UserToCreate } from '../../app/dto/user_dto.js'
import { ServiceResponse } from '../../app/types/service_response.js'
import app from '@adonisjs/core/services/app'

test.group('Users', () => {
  test('email already registered', async ({ client }) => {
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

    const response = await client.post('/register').form({
      name: 'joao',
      email: 'joao@email.com',
      password: '123456',
    })

    response.assertStatus(409)
    response.assertBody({ error: 'User already registered' })
  })

  test('create a user', async ({ client }) => {
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

    const response = await client.post('/register').form({
      name: 'joao',
      email: 'joao@email.com',
      password: '123456',
    })

    response.assertStatus(201)
    response.assertBody(data)
  })

  test('login without password', async ({ client }) => {
    const response = await client.post('/login').form({
      email: 'joao@email.com',
      passwor: '123456',
    })

    response.assertStatus(422)
  })

  test('login with invalid password', async ({ client }) => {
    const response = await client.post('/login').form({
      email: 'joao@email.com',
      password: '12345',
    })

    response.assertStatus(422)
  })

  test('login without email', async ({ client }) => {
    const response = await client.post('/login').form({
      emai: 'joao@email.com',
      password: '123456',
    })

    response.assertStatus(422)
  })

  test('login with invalid email', async ({ client }) => {
    const response = await client.post('/login').form({
      email: 'joaoemail.com',
      password: '123456',
    })

    response.assertStatus(422)
  })

  test('login', async ({ client }) => {
    const token = { token: 'token' } as unknown as AccessToken

    class FakeService extends UserService {
      async login(_email: string, _password: string): Promise<ServiceResponse<AccessToken>> {
        return {
          status: 'OK',
          data: token,
        }
      }
    }

    app.container.swap(UserService, () => {
      return new FakeService()
    })

    const response = await client.post('/login').form({
      email: 'joao@email.com',
      password: '123456',
    })

    response.assertStatus(200)
    response.assertBody(token)
  })
})
