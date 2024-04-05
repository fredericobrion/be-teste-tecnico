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
import { PhoneClientDto } from '../dto/phone_dto.js'
import { SalesClientDto } from '../dto/sale_dto.js'
import { DateTime } from 'luxon'
import FormatTransformer from '../utils/format_transformer.js'

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
      client.cpf = FormatTransformer.unformatCpf(data.cpf)
      client.email = data.email
      client.name = data.name
      client.useTransaction(trx)
      await client.save()

      const address = new Address()
      address.cep = FormatTransformer.unformatCep(data.cep)
      address.complement = data.complement ?? null
      address.neighborhood = data.neighborhood
      address.number = data.number
      address.street = data.street
      address.clientId = client.id
      address.city = data.city
      address.uf = data.uf.toLocaleUpperCase()
      address.useTransaction(trx)
      await address.save()

      const phone = new Phone()
      phone.clientId = client.id
      phone.number = FormatTransformer.unformatPhone(data.phone)
      phone.useTransaction(trx)
      await phone.save()

      clientCreated.id = client.id
      clientCreated.name = client.name
      clientCreated.email = client.email
      clientCreated.cpf = FormatTransformer.formatCpf(client.cpf)
      clientCreated.addressId = address.id
      clientCreated.phone = FormatTransformer.formatPhone(phone.number)
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
    const client = await Client.find(id)
    if (!client) {
      return { status: 'NOT_FOUND', data: { message: 'Client not found' } }
    }

    if ('cpf' in data) {
      const clientInDbWithCpf = await Client.findBy('cpf', data.cpf)
      if (clientInDbWithCpf && clientInDbWithCpf.id !== id) {
        return { status: 'CONFLICT', data: { message: 'CPF already registered' } }
      }
    }

    if ('email' in data) {
      const clientInDbWithEmail = await Client.findBy('email', data.email)
      if (clientInDbWithEmail && clientInDbWithEmail.id !== id) {
        return { status: 'CONFLICT', data: { message: 'Email already registered' } }
      }
    }

    const address = await Address.findOrFail(client.id)
    const phone = await Phone.findOrFail(client.id)

    await db.transaction(async (trx) => {
      client.useTransaction(trx)
      address.useTransaction(trx)
      phone.useTransaction(trx)

      for (const key in data) {
        if (['name', 'cpf', 'email'].includes(key)) {
          await client.merge({ [key]: data[key] }).save()
        } else if (key === 'phone' && data[key]) {
          await phone.merge({ number: data[key]?.toString() }).save()
        } else {
          await address.merge({ [key]: data[key] }).save()
        }
      }
    })

    const clientUpdated = await Client.findOrFail(id)

    return {
      status: 'OK',
      data: new ClientCreatedDto(
        clientUpdated.id,
        clientUpdated.name,
        clientUpdated.email,
        clientUpdated.cpf,
        address.id,
        phone.number
      ),
    }
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
      return { status: 'NOT_FOUND', data: { message: 'Client not found' } }
    }

    const filteredSales =
      month && year
        ? client.sales.filter((sale) => {
            return sale.createdAt.month === Number(month) && sale.createdAt.year === Number(year)
          })
        : client.sales

    const orderedSales = filteredSales.sort(
      (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
    )

    const clientAddress = new AddressClientDto(
      client.address.street,
      client.address.number,
      client.address.complement,
      client.address.neighborhood,
      client.address.cep,
      client.address.city,
      client.address.uf
    )

    const clientPhone = new PhoneClientDto(client.phone.id, client.phone.number)

    const clientSales = orderedSales.map((sale) => {
      const dateTime = DateTime.fromISO(sale.createdAt.toISO() || '')
      const formattedDateTime = dateTime.toFormat('dd/MM/yyyy HH:mm:ss')
      return new SalesClientDto(
        sale.id,
        sale.productId,
        sale.quantity,
        sale.unitPrice,
        sale.totalPrice,
        formattedDateTime
      )
    })

    const clientWithSales = new ClientWithSales(
      client.id,
      client.name,
      client.email,
      client.cpf,
      clientAddress,
      clientPhone,
      clientSales
    )

    return { status: 'OK', data: clientWithSales }
  }

  async deleteClient(id: number): Promise<ServiceResponse<null | string>> {
    const client = await Client.find(id)

    if (!client) {
      return { status: 'NOT_FOUND', data: { message: 'Client not found' } }
    }

    await client.delete()
    return { status: 'NO_CONTENT', data: null }
  }
}
