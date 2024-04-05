import { HttpContext } from '@adonisjs/core/http'
import RegisterService from '../services/users_service.js'
import { inject } from '@adonisjs/core'
import mapStatusHTTP from '../utils/map_status_http.js'
import { createUserValidator } from '../validators/users.js'

export default class UserController {
  @inject()
  async signup({ request, response }: HttpContext, service: RegisterService) {
    const payload = await request.validateUsing(createUserValidator)

    try {
      const serviceResponse = await service.createUser(payload)

      return response.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data)
    } catch (error) {
      return response.status(400).json({ error: error.message })
    }
  }
}
