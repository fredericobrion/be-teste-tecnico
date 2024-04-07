import factory from '@adonisjs/lucid/factories'
import Client from '#models/client'
import { AddressFactory } from './address_factory.js'
import { PhoneFactory } from './phone_factory.js'
import { SaleFactory } from './sale_factory.js'

export const ClientFactory = factory
  .define(Client, async ({ faker }) => {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      cpf: faker.string.numeric({ length: 11, allowLeadingZeros: true }),
    }
  })
  .relation('address', () => AddressFactory)
  .relation('phone', () => PhoneFactory)
  .relation('sales', () => SaleFactory)
  .build()
