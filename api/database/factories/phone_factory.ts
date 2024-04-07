import factory from '@adonisjs/lucid/factories'
import Phone from '#models/phone'

export const PhoneFactory = factory
  .define(Phone, async ({ faker }) => {
    return {
      clientId: faker.number.int({ min: 1, max: 100 }),
      number: '(11) 99999-9999',
    }
  })
  .build()
