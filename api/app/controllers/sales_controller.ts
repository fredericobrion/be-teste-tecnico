import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import SaleService from '../services/sales_service.js'
import mapStatusHTTP from '../utils/map_status_http.js'

export default class SalesController {
  @inject()
  async store({ request, response, params }: HttpContext, service: SaleService) {
    const clientId = Number(params.clientId)
    const data = request.only(['productId', 'quantity'])
    try {
      const serviceResponse = await service.createSale(clientId, data.productId, data.quantity)
      return response.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data)
    } catch (error) {
      return response.status(400).json({ error: error.message })
    }
  }
}
