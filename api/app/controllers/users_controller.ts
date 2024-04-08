import { HttpContext } from '@adonisjs/core/http'
import UserService from '../services/user_service.js'
import { inject } from '@adonisjs/core'
import mapStatusHTTP from '../utils/map_status_http.js'
import { createUserValidator, loginValidator } from '../validators/user.js'

export default class UsersController {
  @inject()
  async signup({ request, response }: HttpContext, service: UserService) {
    const payload = await request.validateUsing(createUserValidator)

    try {
      const serviceResponse = await service.createUser(payload)

      return response.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data)
    } catch (error) {
      return response.status(400).json({ error: error.message })
    }
  }

  @inject()
  async login({ request, response }: HttpContext, service: UserService) {
    const payload = await request.validateUsing(loginValidator)

    try {
      const serviceResponse = await service.login(payload.email, payload.password)

      return response.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data)
    } catch (error) {
      return response.status(400).json({ error: error.message })
    }
  }
}
