import {
  ClientCreatedDto,
  ClientToCreate,
  ClientToUpdate,
  ClientWithSales,
} from '../dto/client_dto.js'
import Client from '../models/client.js'
import { ServiceResponse } from '../types/service_response.js'
import Address from '../models/address.js'
import Phone from '../models/phone.js'
import db from '@adonisjs/lucid/services/db'
import { AddressClientDto } from '../dto/address_dto.js'
import { SalesClientDto } from '../dto/sale_dto.js'
import FormatTransformer from '../utils/format_transformer.js'

export default class ClientService {
  async createClient(data: ClientToCreate): Promise<ServiceResponse<ClientCreatedDto>> {
    const clientInDbWithCpf = await Client.findBy('cpf', data.cpf)
    if (clientInDbWithCpf) {
      return { status: 'CONFLICT', data: { error: 'CPF already registered' } }
    }

    const clientInDbWithEmail = await Client.findBy('email', data.email)
    if (clientInDbWithEmail) {
      return { status: 'CONFLICT', data: { error: 'Email already registered' } }
    }

    const clientCreated = new ClientCreatedDto(0, '', '', '', 0, '')

    await db.transaction(async (trx) => {
      const client = new Client()
      client.cpf = FormatTransformer.unformatCpf(data.cpf)
      client.email = data.email
      client.name = data.name
      client.useTransaction(trx)
      const savedClient = await client.save()

      const address = new Address()
      address.cep = FormatTransformer.unformatCep(data.cep)
      address.complement = data.complement ?? ''
      address.neighborhood = data.neighborhood
      address.number = data.number
      address.street = data.street
      address.clientId = client.id
      address.city = data.city
      address.uf = data.uf.toLocaleUpperCase()
      address.useTransaction(trx)
      const savedAddress = await address.save()

      const phone = new Phone()
      phone.clientId = client.id
      phone.number = FormatTransformer.unformatPhone(data.phone)
      phone.useTransaction(trx)
      await phone.save()

      clientCreated.id = savedClient.id
      clientCreated.name = client.name
      clientCreated.email = client.email
      clientCreated.cpf = FormatTransformer.formatCpf(client.cpf)
      clientCreated.addressId = savedAddress.id
      clientCreated.phone = FormatTransformer.formatPhone(phone.number)
    })

    return { status: 'CREATED', data: clientCreated }
  }

  async getAllClients(): Promise<ServiceResponse<ClientCreatedDto[]>> {
    const clients = await Client.query().preload('address').preload('phone')

    const orderedClients = clients.sort((a, b) => a.id - b.id)

    const clientsToReturn = orderedClients.map((client) => {
      return new ClientCreatedDto(
        client.id,
        client.name,
        client.email,
        FormatTransformer.formatCpf(client.cpf),
        client.address.id,
        FormatTransformer.formatPhone(client.phone.number)
      )
    })

    return { status: 'OK', data: clientsToReturn }
  }

  async updateClient(id: number, data: ClientToUpdate): Promise<ServiceResponse<ClientCreatedDto>> {
    const client = await Client.find(id)
    if (!client) {
      return { status: 'NOT_FOUND', data: { error: 'Client not found' } }
    }

    if (data.cpf) {
      data.cpf = FormatTransformer.unformatCpf(data.cpf)
      const clientInDbWithCpf = await Client.findBy('cpf', data.cpf)
      if (clientInDbWithCpf && clientInDbWithCpf.id !== id) {
        return { status: 'CONFLICT', data: { error: 'CPF already registered' } }
      }
    }

    if (data.email) {
      const clientInDbWithEmail = await Client.findBy('email', data.email)
      if (clientInDbWithEmail && clientInDbWithEmail.id !== id) {
        return { status: 'CONFLICT', data: { error: 'Email already registered' } }
      }
    }

    if (data.phone) {
      data.phone = FormatTransformer.unformatPhone(data.phone)
    }

    if (data.cep) data.cep = FormatTransformer.unformatCep(data.cep)

    const address = await Address.findByOrFail('clientId', client.id)
    const phone = await Phone.findByOrFail('clientId', client.id)

    await db.transaction(async (trx) => {
      client.useTransaction(trx)
      address.useTransaction(trx)
      phone.useTransaction(trx)

      for (const key in data) {
        if (['name', 'cpf', 'email'].includes(key)) {
          await client.merge({ [key]: data[key as keyof ClientToUpdate] }).save()
        } else if (key === 'phone' && data[key]) {
          await phone.merge({ number: data[key]?.toString() }).save()
        } else {
          await address.merge({ [key]: data[key as keyof ClientToUpdate] }).save()
        }
      }
    })

    const clientUpdated = await Client.findOrFail(id)

    const clientToReturn = new ClientCreatedDto(
      clientUpdated.id,
      clientUpdated.name,
      clientUpdated.email,
      FormatTransformer.formatCpf(clientUpdated.cpf),
      address.id,
      FormatTransformer.formatPhone(phone.number)
    )

    return { status: 'OK', data: clientToReturn }
  }

  async getClientById(
    id: number,
    month?: string,
    year?: string
  ): Promise<ServiceResponse<ClientWithSales>> {
    const client = await Client.query()
      .where('id', id)
      .preload('address')
      .preload('phone')
      .preload('sales')
      .first()

    if (!client) {
      return { status: 'NOT_FOUND', data: { error: 'Client not found' } }
    }

    const filteredByMonth = month
      ? client.sales.filter((sale) => sale.createdAt.month === Number(month))
      : client.sales

    const filteredByYearAndMonth = year
      ? filteredByMonth.filter((sale) => sale.createdAt.year === Number(year))
      : filteredByMonth

    const orderedSales = filteredByYearAndMonth.sort(
      (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
    )

    const clientAddress = new AddressClientDto(
      client.address.street,
      client.address.number,
      client.address.complement,
      client.address.neighborhood,
      FormatTransformer.formatCep(client.address.cep),
      client.address.city,
      client.address.uf.toLocaleUpperCase()
    )

    const clientSales = orderedSales.map((sale) => {
      return new SalesClientDto(
        sale.id,
        sale.productId,
        Number(sale.quantity),
        Number(sale.unitPrice),
        Number(sale.totalPrice),
        FormatTransformer.formatDate(sale.createdAt)
      )
    })

    const clientWithSales = new ClientWithSales(
      client.id,
      client.name,
      client.email,
      FormatTransformer.formatCpf(client.cpf),
      clientAddress,
      FormatTransformer.formatPhone(client.phone.number),
      clientSales
    )

    return { status: 'OK', data: clientWithSales }
  }

  async deleteClient(id: number): Promise<ServiceResponse<null | string>> {
    const client = await Client.find(id)

    if (!client) {
      return { status: 'NOT_FOUND', data: { error: 'Client not found' } }
    }

    await client.delete()
    return { status: 'NO_CONTENT', data: null }
  }
}
