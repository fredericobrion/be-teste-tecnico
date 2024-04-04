import { ClientCreatedDto, ClientToCreate } from '../dto/client_dto.js'
import Client from '../models/client.js'
import { ServiceResponse } from '../types/service_response.js'
import City from '../models/city.js'
import Address from '../models/address.js'
import Phone from '../models/phone.js'
import db from '@adonisjs/lucid/services/db'

export default class ClientService {
  async createClient(data: ClientToCreate): Promise<ServiceResponse<ClientCreatedDto>> {
    const clientInDbWithCpf = await Client.findBy('cpf', data.cpf)
    if (clientInDbWithCpf) {
      return { status: 'CONFLICT', data: { message: 'CPF already registered' } }
    }
    const clientInDbWithEmail = await Client.findBy('email', data.email)
    if (clientInDbWithEmail) {
      return { status: 'CONFLICT', data: { message: 'Email already registered' } }
    }

    const cityInDb = await City.findBy('name', data.city)

    const clientCreated = new ClientCreatedDto(0, '', '', '', 0, '')

    await db.transaction(async (trx) => {
      let cityId
      if (!cityInDb) {
        const city = new City()
        city.name = data.city
        city.uf = data.uf
        city.useTransaction(trx)
        const createdCity = await city.save()
        cityId = createdCity.id
      }

      const client = new Client()
      client.cpf = data.cpf
      client.email = data.email
      client.name = data.name
      client.useTransaction(trx)
      await client.save()

      const address = new Address()
      address.cep = data.cep
      address.cityId = cityInDb ? cityInDb.id : cityId || 0
      address.complement = data.complement
      address.neighborhood = data.neighborhood
      address.number = data.number
      address.street = data.street
      address.clientId = client.id
      address.useTransaction(trx)
      await address.save()

      const phone = new Phone()
      phone.clientId = client.id
      phone.number = data.phone
      phone.useTransaction(trx)
      await phone.save()

      clientCreated.id = client.id
      clientCreated.name = client.name
      clientCreated.email = client.email
      clientCreated.cpf = client.cpf
      clientCreated.addressId = address.id
      clientCreated.phone = phone.number
    })
    if (clientCreated.id !== 0) {
      return { status: 'CREATED', data: clientCreated }
    }
    return { status: 'INTERNAL_SERVER_ERROR', data: { message: 'Error creating client' } }
  }

  async getAllClients(): Promise<ServiceResponse<ClientCreatedDto[]>> {
    const clients = await Client.query().preload('address').preload('phone')

    const orderedClients = clients.sort((a, b) => a.id - b.id)

    return {
      status: 'OK',
      data: orderedClients.map((client) => {
        return new ClientCreatedDto(
          client.id,
          client.name,
          client.email,
          client.cpf,
          client.address.id,
          client.phone.number
        )
      }),
    }
  }
}
