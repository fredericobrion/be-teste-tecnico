import User from '../models/user.js'
import { UserCreatedDto, UserToCreate } from '../dto/user_dto.js'
import { ServiceResponse } from '../types/service_response.js'
import { AccessToken } from '@adonisjs/auth/access_tokens'

export default class UserService {
  async createUser(data: UserToCreate): Promise<ServiceResponse<UserCreatedDto>> {
    const userAlreadyExists = await User.findBy('email', data.email)
    if (userAlreadyExists) {
      return { status: 'CONFLICT', data: { error: 'User already registered' } }
    }

    const user = await User.create(data)

    const token = await User.accessTokens.create(user)

    const createdUser = new UserCreatedDto(user.id, user.name, user.email, token)

    return { status: 'CREATED', data: createdUser }
  }

  async login(email: string, password: string): Promise<ServiceResponse<AccessToken>> {
    const user = await User.verifyCredentials(email, password)

    const token = await User.accessTokens.create(user)

    return { status: 'OK', data: token }
  }
}
