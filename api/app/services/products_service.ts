import { DateTime } from 'luxon'
import { ProductToCreate, ProductToUpdate, ProductCreatedOrUpdated } from '../dto/product_dto.js'
import Product from '../models/product.js'
import { ServiceResponse } from '../types/service_response.js'

export default class ProductService {
  async createProduct(data: ProductToCreate): Promise<ServiceResponse<ProductCreatedOrUpdated>> {
    const productInDbWithName = await Product.findBy('name', data.name)
    if (productInDbWithName && productInDbWithName.deletedAt === null) {
      return { status: 'CONFLICT', data: { message: 'Product already registered' } }
    }

    const product = await Product.create(data)
    return { status: 'CREATED', data: product }
  }

  async getProductById(id: number): Promise<ServiceResponse<ProductCreatedOrUpdated>> {
    const product = await Product.find(id)
    if (!product) {
      return { status: 'NOT_FOUND', data: { message: 'Product not found' } }
    }

    const formattedProduct = new ProductCreatedOrUpdated(
      product.id,
      product.name,
      product.description,
      product.price
    )

    return { status: 'OK', data: formattedProduct }
  }

  async updateProduct(
    id: number,
    data: ProductToUpdate
  ): Promise<ServiceResponse<ProductCreatedOrUpdated>> {
    const product = await Product.find(id)
    if (!product || product.deletedAt !== null) {
      return { status: 'NOT_FOUND', data: { message: 'Product not found' } }
    }

    await product.merge(data).save()

    const updatedProduct = new ProductCreatedOrUpdated(
      product.id,
      product.name,
      product.description,
      product.price
    )

    return { status: 'OK', data: updatedProduct }
  }

  async getAllProducts(): Promise<ServiceResponse<ProductCreatedOrUpdated[]>> {
    const products = await Product.query().whereNull('deleted_at')

    const sortedProducts = products.sort((a, b) => a.name.localeCompare(b.name))

    const formattedProducts = sortedProducts.map((product) => {
      return new ProductCreatedOrUpdated(
        product.id,
        product.name,
        product.description,
        product.price
      )
    })

    return { status: 'OK', data: formattedProducts }
  }

  async deleteProduct(id: number): Promise<ServiceResponse<null>> {
    const product = await Product.find(id)
    if (!product || product.deletedAt !== null) {
      return { status: 'NOT_FOUND', data: { message: 'Product not found' } }
    }

    product.deletedAt = DateTime.now()
    await product.save()

    return { status: 'NO_CONTENT', data: null }
  }
}
