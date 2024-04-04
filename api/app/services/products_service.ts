import { DateTime } from 'luxon'
import { ProductToCreate, ProductToUpdate } from '../dto/product_dto.js'
import Product from '../models/product.js'
import { ServiceResponse } from '../types/service_response.js'

export default class ProductService {
  async createProduct(data: ProductToCreate): Promise<ServiceResponse<Product>> {
    const productInDbWithName = await Product.findBy('name', data.name)
    if (productInDbWithName && productInDbWithName.deletedAt === null) {
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

  async getAllProducts(): Promise<ServiceResponse<Product[]>> {
    const products = await Product.query().whereNull('deleted_at')

    const sortedProducts = products.sort((a, b) => a.name.localeCompare(b.name))

    return { status: 'OK', data: sortedProducts }
  }

  async deleteProduct(id: number): Promise<ServiceResponse<Product>> {
    const product = await Product.find(id)
    if (!product || product.deletedAt !== null) {
      return { status: 'NOT_FOUND', data: { message: 'Product not found' } }
    }

    product.deletedAt = DateTime.now()
    await product.save()

    return { status: 'NO_CONTENT', data: product }
  }
}
