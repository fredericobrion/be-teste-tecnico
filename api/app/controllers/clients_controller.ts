import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import ClientService from '../services/client_service.js'
import mapStatusHTTP from '../utils/map_status_http.js'

export default class ClientsController {
  @inject()
  async store({ request, response }: HttpContext, service: ClientService) {
    const data = request.only([
      'name',
      'email',
      'cpf',
      'cep',
      'street',
      'number',
      'complement',
      'neighborhood',
      'city',
      'uf',
      'phone',
    ])

    try {
      const serviceResponse = await service.createClient(data)

      return response.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data)
    } catch (error) {
      return response.status(400).json({ error: error.message })
    }
  }

  @inject()
  async index({ response }: HttpContext, service: ClientService) {
    try {
      const serviceResponse = await service.getAllClients()

      return response.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data)
    } catch (error) {
      return response.status(400).json({ error: error.message })
    }
  }

  @inject()
  async update({ request, response, params }: HttpContext, service: ClientService) {
    const id = params.id
    const data = request.only([
      'id',
      'name',
      'email',
      'cpf',
      'cep',
      'street',
      'number',
      'complement',
      'neighborhood',
      'city',
      'uf',
      'phone',
    ])

    try {
      const serviceResponse = await service.updateClient(Number(id), data)

      return response.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data)
    } catch (error) {
      return response.status(400).json({ error: error.message })
    }
  }
}
