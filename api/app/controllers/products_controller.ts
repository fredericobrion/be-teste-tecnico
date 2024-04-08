import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import ProductService from '../services/product_service.js'
import mapStatusHTTP from '../utils/map_status_http.js'
import { createProductValidator, updateProductValidator } from '../validators/product.js'
import { idValidator } from '../validators/id.js'

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
    const payload = await request.validateUsing(createProductValidator)
    try {
      const serviceResponse = await productService.createProduct(payload)

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
    const payload = await request.validateUsing(updateProductValidator)
    if (Object.keys(payload).length === 0) {
      return response.status(400).json({ error: 'At least one field must be filled' })
    }
    await idValidator.validate({ id: params.id })

    try {
      const serviceResponse = await productService.updateProduct(Number(params.id), payload)
      return response.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data)
    } catch (error) {
      return response.status(400).json({ error: error.message })
    }
  }

  @inject()
  async destroy({ response, params }: HttpContext, productService: ProductService) {
    await idValidator.validate({ id: params.id })

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
