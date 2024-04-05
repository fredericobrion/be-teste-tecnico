import hash from '@adonisjs/core/services/hash'
import User from '../models/user.js'
import { UserCreatedDto, UserToCreate } from '../dto/user_dto.js'
import { ServiceResponse } from '../types/service_response.js'
import { AccessToken } from '@adonisjs/auth/access_tokens'

export default class UserService {
  async createUser(data: UserToCreate): Promise<ServiceResponse<UserCreatedDto>> {
    const userAlreadyExists = await User.findBy('email', data.email)
    if (userAlreadyExists) {
      return { status: 'CONFLICT', data: { message: 'User already registered' } }
    }

    // data.password = await hash.make(data.password)
    const user = await User.create(data)

    const createdUser = new UserCreatedDto(user.id, user.name, user.email)

    return { status: 'CREATED', data: createdUser }
  }

  async login(email: string, password: string): Promise<ServiceResponse<AccessToken>> {
    const user = await User.findBy('email', email)
    if (!user) {
      return { status: 'UNAUTHORIZED', data: { message: 'Password and/or Email incorrects' } }
    }
    if (!(await hash.verify(user.password, password))) {
      return { status: 'UNAUTHORIZED', data: { message: 'Password and/or Email incorrects' } }
    }

    const token = await User.accessTokens.create(user)

    return { status: 'OK', data: token }
  }
}
