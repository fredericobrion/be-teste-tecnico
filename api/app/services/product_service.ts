import { ProductToCreate, ProductToUpdate } from '../dto/product_dto.js'
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

  async getProductById(id: number): Promise<ServiceResponse<Product>> {
    const product = await Product.find(id)
    if (!product) {
      return { status: 'NOT_FOUND', data: { message: 'Product not found' } }
    }

    return { status: 'OK', data: product }
  }

  async updateProduct(id: number, data: ProductToUpdate): Promise<ServiceResponse<Product>> {
    const product = await Product.find(id)
    if (!product) {
      return { status: 'NOT_FOUND', data: { message: 'Product not found' } }
    }

    await product.merge(data).save()
    return { status: 'OK', data: product }
  }
}
