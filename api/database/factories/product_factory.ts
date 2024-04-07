import factory from '@adonisjs/lucid/factories'
import Product from '#models/product'
import { DateTime } from 'luxon'

export const ProductFactory = factory
  .define(Product, async ({ faker }) => {
    return {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: Number(faker.commerce.price()),
      deletedAt: DateTime.local(),
    }
  })
  .build()
