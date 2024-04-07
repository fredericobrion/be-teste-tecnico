import factory from '@adonisjs/lucid/factories'
import Address from '#models/address'

export const AddressFactory = factory
  .define(Address, async ({ faker }) => {
    return {
      clientId: faker.number.int({ min: 1, max: 100 }),
      street: faker.location.street(),
      number: faker.location.buildingNumber(),
      complement: faker.location.secondaryAddress(),
      neighborhood: faker.string.alpha({ length: 10 }),
      cep: '35894-250',
      city: faker.location.city(),
      uf: faker.string.alpha({ length: 2 }),
    }
  })
  .build()
