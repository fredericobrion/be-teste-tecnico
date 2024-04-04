import { ClientCreatedDto, ClientToCreate, ClientToUpdate } from '../dto/client_dto.js'
import Client from '../models/client.js'
import { ServiceResponse } from '../types/service_response.js'
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

    const clientCreated = new ClientCreatedDto(0, '', '', '', 0, '')

    await db.transaction(async (trx) => {
      const client = new Client()
      client.cpf = data.cpf
      client.email = data.email
      client.name = data.name
      client.useTransaction(trx)
      await client.save()

      const address = new Address()
      address.cep = data.cep
      address.complement = data.complement
      address.neighborhood = data.neighborhood
      address.number = data.number
      address.street = data.street
      address.clientId = client.id
      address.city = data.city
      address.uf = data.uf
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

  async updateClient(id: number, data: ClientToUpdate): Promise<ServiceResponse<ClientCreatedDto>> {
    const client = await Client.findOrFail(id)

    const clientInDbWithCpf = await Client.findBy('cpf', data.cpf)
    if (clientInDbWithCpf && clientInDbWithCpf.id !== id) {
      return { status: 'CONFLICT', data: { message: 'CPF already registered' } }
    }

    const clientInDbWithEmail = await Client.findBy('email', data.email)
    if (clientInDbWithEmail && clientInDbWithEmail.id !== id) {
      return { status: 'CONFLICT', data: { message: 'Email already registered' } }
    }

    // const address = await Address.findOrFail(client.id)
    // const phone = await Phone.findOrFail(client.id)

    // const clientData: Partial<Client> = {}
    // const addressData: { [key: string]: string } = {}
    // const phoneData: { phone: string } = {}

    // for (const key in data) {
    //   if (['name', 'cpf', 'email'].includes(key)) {
    //     clientData[key] = data[key]
    //   } else if (key === 'phone' && data[key]) {
    //     phoneData.phone = data[key]
    //   } else {
    //     addressData[key] = data[key]
    //   }
    // }

    // await db.transaction(async (trx) => {})
    return { status: 'CONFLICT', data: { message: 'Not implemented yet' } }
  }
}
