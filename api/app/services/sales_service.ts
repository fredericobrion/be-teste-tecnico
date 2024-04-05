import Client from '../models/client.js'
import Product from '../models/product.js'
import Sale from '../models/sale.js'
import { ServiceResponse } from '../types/service_response.js'
import { SaleCreated } from '../dto/sale_dto.js'
import { DateTime } from 'luxon'

export default class SaleService {
  async createSale(
    clientId: number,
    productId: number,
    quantity: number,
    createdAt: Date | undefined
  ): Promise<ServiceResponse<SaleCreated>> {
    const product = await Product.find(productId)
    if (!product || product.deletedAt !== null) {
      return { status: 'NOT_FOUND', data: { message: 'Product not found' } }
    }

    const client = await Client.find(clientId)
    if (!client) {
      return { status: 'NOT_FOUND', data: { message: 'Client not found' } }
    }

    const date = DateTime.fromISO(createdAt?.toISOString() ?? '')

    const totalPrice = product.price * quantity

    const sale = await Sale.create({
      clientId,
      productId,
      quantity,
      unitPrice: product.price,
      totalPrice,
      createdAt: createdAt ? date : DateTime.now(),
    })

    const dateTime = DateTime.fromISO(sale.createdAt?.toISO() || '')
    const formattedDateTime = dateTime.toFormat('dd/MM/yyyy HH:mm:ss')

    const saleToReturn = new SaleCreated(
      sale.id,
      sale.clientId,
      sale.productId,
      sale.quantity,
      Number(sale.unitPrice),
      sale.totalPrice,
      formattedDateTime
    )

    return { status: 'CREATED', data: saleToReturn }
  }
}
