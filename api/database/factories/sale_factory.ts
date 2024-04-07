import factory from '@adonisjs/lucid/factories'
import Sale from '#models/sale'

export const SaleFactory = factory
  .define(Sale, async ({ faker }) => {
    return {
      clientId: faker.number.int({ min: 1, max: 100 }),
      productId: faker.number.int({ min: 1, max: 100 }),
      quantity: faker.number.int({ min: 1, max: 10 }),
      unitPrice: faker.number.float({ min: 1, max: 1000 }),
      totalPrice: faker.number.float({ min: 1, max: 1000 }),
    }
  })
  .build()
