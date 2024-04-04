import { ProductToCreate } from '../dto/product_dto.js'
import Product from '../models/product.js'
import { ServiceResponse } from '../types/service_response.js'

export default class ProductService {
  async createProduct(data: ProductToCreate): Promise<ServiceResponse<Product>> {
    const productInDbWithName = await Product.findBy('name', data.name)
    if (productInDbWithName) {
      return { status: 'CONFLICT', data: { message: 'Product already registered' } }
    }

    const product = await Product.create(data)
    return { status: 'CREATED', data: product }
  }
}
