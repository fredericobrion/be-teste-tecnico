import { test } from '@japa/runner'
import UserService from '../../../app/services/users_service.js'
import { UserFactory } from '../../../database/factories/user_factory.js'
import Sinon from 'sinon'
import User from '../../../app/models/user.js'
import { UserCreatedDto } from '../../../app/dto/user_dto.js'
import { AccessToken } from '@adonisjs/auth/access_tokens'

test.group('Users service', () => {
  test('email already registered', async ({ assert }) => {
    const mockedUser = await UserFactory.makeStubbed()

    const userService = new UserService()

    Sinon.stub(User, 'findBy').resolves(mockedUser)

    const response = await userService.createUser({
      name: mockedUser.name,
      email: mockedUser.email,
      password: mockedUser.password,
    })

    assert.equal(response.status, 'CONFLICT')
    assert.deepEqual(response.data, { error: 'User already registered' })
  }).cleanup(() => Sinon.restore())

  test('create user', async ({ assert }) => {
    const mockedUser = await UserFactory.makeStubbed()

    const userService = new UserService()

    Sinon.stub(User, 'findBy').resolves(null)
    Sinon.stub(User, 'create').resolves(mockedUser)

    const token = { token: 'token' } as unknown as AccessToken
    Sinon.stub(User, 'accessTokens').value({
      create: async () => token,
    })

    const response = await userService.createUser({
      name: mockedUser.name,
      email: mockedUser.email,
      password: mockedUser.password,
    })

    const userCreated = new UserCreatedDto(mockedUser.id, mockedUser.name, mockedUser.email, token)

    assert.equal(response.status, 'CREATED')
    assert.deepEqual(response.data, userCreated)
  }).cleanup(() => Sinon.restore())

  test('login', async ({ assert }) => {
    const mockedUser = await UserFactory.makeStubbed()

    const userService = new UserService()

    Sinon.stub(User, 'verifyCredentials').resolves(mockedUser)
    Sinon.stub(User, 'accessTokens').value({
      create: async () => 'token',
    })

    const response = await userService.login(mockedUser.email, mockedUser.password)

    assert.equal(response.status, 'OK')
    assert.equal(response.data, 'token')
  }).cleanup(() => Sinon.restore())
})
