import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import SaleService from '../services/sales_service.js'
import mapStatusHTTP from '../utils/map_status_http.js'
import { idValidator } from '../validators/id.js'
import { createSaleValidator } from '../validators/sale.js'

export default class SalesController {
  @inject()
  async store({ request, response, params }: HttpContext, service: SaleService) {
    const clientId = params.clientId

    await idValidator.validate({ id: clientId })
    const payload = await request.validateUsing(createSaleValidator)
    try {
      const serviceResponse = await service.createSale(
        Number(clientId),
        payload.productId,
        payload.quantity,
        payload.createdAt
      )
      return response.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data)
    } catch (error) {
      return response.status(400).json({ error: error.message })
    }
  }
}
