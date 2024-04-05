import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import ClientService from '../services/clients_service.js'
import mapStatusHTTP from '../utils/map_status_http.js'
import {
  createClientValidator,
  updateClientValidator,
  monthAndYearValidator,
} from '../validators/client.js'
import { idValidator } from '../validators/id.js'

export default class ClientsController {
  @inject()
  async store({ request, response }: HttpContext, service: ClientService) {
    const payload = await request.validateUsing(createClientValidator)
    try {
      const serviceResponse = await service.createClient(payload)

      return response.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data)
    } catch (error) {
      return response.status(400).json({ error: error.message })
    }
  }

  @inject()
  async show({ response, params, request }: HttpContext, service: ClientService) {
    const id = params.id
    await idValidator.validate({ id: id })
    const { month, year } = request.qs() as unknown as { month: string; year: string }
    await monthAndYearValidator.validate({ month: month, year: year })

    try {
      const serviceResponse = await service.getClientById(Number(id), month, year)

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
    await idValidator.validate({ id: id })
    const payload = await request.validateUsing(updateClientValidator)

    if (Object.keys(payload).length === 0) {
      return response.status(400).json({ error: 'At least one field must be filled' })
    }
    try {
      const serviceResponse = await service.updateClient(Number(id), payload)

      return response.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data)
    } catch (error) {
      return response.status(400).json({ error: error.message })
    }
  }

  @inject()
  async destroy({ response, params }: HttpContext, service: ClientService) {
    const id = params.id
    await idValidator.validate({ id: id })

    try {
      const serviceResponse = await service.deleteClient(Number(id))

      if (serviceResponse.status === 'NOT_FOUND') {
        return response.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data)
      }

      return response.status(mapStatusHTTP(serviceResponse.status))
    } catch (error) {
      return response.status(400).json({ error: error.message })
    }
  }
}
