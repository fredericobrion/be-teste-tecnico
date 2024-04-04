import Client from '../models/client.js'
import Product from '../models/product.js'
import Sale from '../models/sale.js'
import { ServiceResponse } from '../types/service_response.js'
import { SaleCreated } from '../dto/sale_dto.js'

export default class SaleService {
  async createSale(
    clientId: number,
    productId: number,
    quantity: number
  ): Promise<ServiceResponse<SaleCreated>> {
    const product = await Product.find(productId)
    if (!product) {
      return { status: 'NOT_FOUND', data: { message: 'Product not found' } }
    }

    const client = await Client.find(clientId)
    if (!client) {
      return { status: 'NOT_FOUND', data: { message: 'Client not found' } }
    }

    const totalPrice = product.price * quantity

    const sale = await Sale.create({
      clientId,
      productId,
      quantity,
      unitPrice: product.price,
      totalPrice,
    })

    const date = sale.createdAt.toFormat('dd/MM/yyyy HH:mm:ss')

    const saleToReturn = new SaleCreated(
      sale.id,
      sale.clientId,
      sale.productId,
      sale.quantity,
      sale.unitPrice,
      sale.totalPrice,
      date
    )

    return { status: 'CREATED', data: saleToReturn }
  }
}
