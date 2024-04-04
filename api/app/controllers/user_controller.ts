// import type { HttpContext } from '@adonisjs/core/http'
import { HttpContext } from '@adonisjs/core/http'
import RegisterService from '../services/user_service.js'
import { inject } from '@adonisjs/core'
import mapStatusHTTP from '../utils/map_status_http.js'

export default class UserController {
  @inject()
  async signup({ request, response }: HttpContext, service: RegisterService) {
    const data = request.only(['name', 'email', 'password'])
    try {
      const serviceResponse = await service.createUser(data)

      return response.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data)
    } catch (error) {
      return response.status(400).json({ error: error.message })
    }
  }
}
