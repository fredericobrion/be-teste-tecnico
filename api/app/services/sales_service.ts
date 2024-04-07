import Client from '../models/client.js'
import Product from '../models/product.js'
import Sale from '../models/sale.js'
import { ServiceResponse } from '../types/service_response.js'
import { SaleCreated } from '../dto/sale_dto.js'
import { DateTime } from 'luxon'
import FormatTransformer from '../utils/format_transformer.js'

export default class SaleService {
  async createSale(
    clientId: number,
    productId: number,
    quantity: number,
    createdAt: Date | undefined
  ): Promise<ServiceResponse<SaleCreated>> {
    const product = await Product.query().whereNull('deleted_at').where('id', productId).first()
    if (!product) {
      return { status: 'NOT_FOUND', data: { error: 'Product not found' } }
    }

    const client = await Client.find(clientId)
    if (!client) {
      return { status: 'NOT_FOUND', data: { error: 'Client not found' } }
    }

    const totalPrice = product.price * quantity

    const sale = await Sale.create({
      clientId,
      productId,
      quantity,
      unitPrice: product.price,
      totalPrice,
      createdAt: createdAt ? DateTime.fromISO(createdAt?.toISOString()) : DateTime.now(),
    })

    console.log('DATA CRIADA', sale.createdAt)

    const saleToReturn = new SaleCreated(
      sale.id,
      sale.clientId,
      sale.productId,
      sale.quantity,
      Number(sale.unitPrice),
      sale.totalPrice,
      FormatTransformer.formatDate(sale.createdAt)
    )

    return { status: 'CREATED', data: saleToReturn }
  }
}
