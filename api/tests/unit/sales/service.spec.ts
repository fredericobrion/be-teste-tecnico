import { test } from '@japa/runner'
import SaleService from '../../../app/services/sales_service.js'
import { SaleFactory } from '../../../database/factories/sale_factory.js'
import { ProductFactory } from '../../../database/factories/product_factory.js'
import { ClientFactory } from '../../../database/factories/client_factory.js'
import Sale from '../../../app/models/sale.js'
import Product from '../../../app/models/product.js'
import Client from '../../../app/models/client.js'
import Sinon from 'sinon'
import { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import FormatTransformer from '../../../app/utils/format_transformer.js'
import { DateTime } from 'luxon'

test.group('Sales service', () => {
  test('product not found when creating sale', async ({ assert }) => {
    Sinon.stub(Product, 'query').returns({
      whereNull: () => ({
        where: () => ({
          first: () => null,
        }),
      }),
    } as unknown as ModelQueryBuilderContract<typeof Product>)

    const service = new SaleService()
    const response = await service.createSale(1, 1, 1, new Date())

    assert.equal(response.status, 'NOT_FOUND')
    assert.deepEqual(response.data, { error: 'Product not found' })
  }).cleanup(() => Sinon.restore())

  test('client not found when creating sale', async ({ assert }) => {
    const product = await ProductFactory.makeStubbed()

    Sinon.stub(Product, 'query').returns({
      whereNull: () => ({
        where: () => ({
          first: () => product,
        }),
      }),
    } as unknown as ModelQueryBuilderContract<typeof Product>)

    Sinon.stub(Client, 'find').resolves(null)

    const service = new SaleService()
    const response = await service.createSale(1, 1, 1, new Date())

    assert.equal(response.status, 'NOT_FOUND')
    assert.deepEqual(response.data, { error: 'Client not found' })
  }).cleanup(() => Sinon.restore())

  test('creates a sale', async ({ assert }) => {
    const product = await ProductFactory.makeStubbed()
    const client = await ClientFactory.makeStubbed()

    Sinon.stub(Product, 'query').returns({
      whereNull: () => ({
        where: () => ({
          first: () => product,
        }),
      }),
    } as unknown as ModelQueryBuilderContract<typeof Product>)

    Sinon.stub(Client, 'find').resolves(client)

    const sale = await SaleFactory.makeStubbed()

    sale.clientId = client.id
    sale.productId = product.id
    sale.unitPrice = product.price
    sale.totalPrice = product.price * sale.quantity
    const date = new Date('2024-03-15T12:00:00')
    sale.createdAt = DateTime.fromISO(date.toISOString())

    Sinon.stub(Sale, 'create').resolves(sale)

    const service = new SaleService()
    const response = await service.createSale(client.id, product.id, sale.quantity, date)

    assert.equal(response.status, 'CREATED')
    assert.deepEqual(response.data, {
      id: sale.id,
      clientId: sale.clientId,
      productId: sale.productId,
      quantity: sale.quantity,
      unitPrice: Number(sale.unitPrice),
      totalPrice: sale.totalPrice,
      createdAt: FormatTransformer.formatDate(sale.createdAt),
    })
  }).cleanup(() => Sinon.restore())
})
