import hash from '@adonisjs/core/services/hash'
import User from '../models/user.js'
import { UserCreatedDto, UserToCreate } from '../dto/user_dto.js'
import { ServiceResponse } from '../types/service_response.js'

export default class RegisterService {
  async createUser(data: UserToCreate): Promise<ServiceResponse<UserCreatedDto>> {
    const userAlreadyExists = await User.findBy('email', data.email)
    if (userAlreadyExists) {
      return { status: 'CONFLICT', data: { message: 'User already registered' } }
    }

    data.password = await hash.make(data.password)
    const user = await User.create(data)

    const createdUser = new UserCreatedDto(user.id, user.name, user.email)

    return { status: 'CREATED', data: createdUser }
  }
}
