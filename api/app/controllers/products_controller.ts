import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import ProductService from '../services/products_service.js'
import mapStatusHTTP from '../utils/map_status_http.js'

export default class ProductsController {
  @inject()
  async index({ response }: HttpContext, productService: ProductService) {
    try {
      const serviceResponse = await productService.getAllProducts()
      return response.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data)
    } catch (error) {
      return response.status(400).json({ error: error.message })
    }
  }

  @inject()
  async store({ request, response }: HttpContext, productService: ProductService) {
    const data = request.only(['name', 'description', 'price'])
    try {
      const serviceResponse = await productService.createProduct(data)

      return response.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data)
    } catch (error) {
      return response.status(400).json({ error: error.message })
    }
  }

  @inject()
  async show({ response, params }: HttpContext, productService: ProductService) {
    try {
      const serviceResponse = await productService.getProductById(Number(params.id))
      return response.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data)
    } catch (error) {
      return response.status(400).json({ error: error.message })
    }
  }

  @inject()
  async update({ request, response, params }: HttpContext, productService: ProductService) {
    const data = request.only(['name', 'description', 'price'])
    try {
      const serviceResponse = await productService.updateProduct(Number(params.id), data)
      return response.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data)
    } catch (error) {
      return response.status(400).json({ error: error.message })
    }
  }

  @inject()
  async delete({ response, params }: HttpContext, productService: ProductService) {
    try {
      const serviceResponse = await productService.deleteProduct(Number(params.id))
      if (serviceResponse.status === 'NOT_FOUND') {
        return response.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data)
      }
      return response.status(mapStatusHTTP(serviceResponse.status))
    } catch (error) {
      return response.status(400).json({ error: error.message })
    }
  }
}
