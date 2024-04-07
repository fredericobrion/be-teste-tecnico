import { test } from '@japa/runner'
import ClientsService from '../../../app/services/clients_service.js'
import { ClientFactory } from '../../../database/factories/client_factory.js'
import Client from '../../../app/models/client.js'
import Address from '../../../app/models/address.js'
import Phone from '../../../app/models/phone.js'
import Sinon from 'sinon'
import FormatTransformer from '../../../app/utils/format_transformer.js'
import { AddressFactory } from '../../../database/factories/address_factory.js'
import { PhoneFactory } from '../../../database/factories/phone_factory.js'
import { ClientCreatedDto, ClientWithSales } from '../../../app/dto/client_dto.js'
import { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import { DateTime } from 'luxon'
import { AddressClientDto } from '../../../app/dto/address_dto.js'
import { PhoneClientDto } from '../../../app/dto/phone_dto.js'

test.group('Clients service', () => {
  test('cpf already registered', async ({ assert }) => {
    const mockedClient = await ClientFactory.with('address').with('phone').makeStubbed()

    const clientsService = new ClientsService()

    Sinon.stub(Client, 'findBy').resolves(mockedClient)

    const response = await clientsService.createClient({
      name: mockedClient.name,
      cpf: mockedClient.cpf,
      email: mockedClient.email,
      cep: mockedClient.address.cep,
      city: mockedClient.address.city,
      complement: mockedClient.address.complement ?? '',
      neighborhood: mockedClient.address.neighborhood,
      number: mockedClient.address.number,
      phone: mockedClient.phone.number,
      street: mockedClient.address.street,
      uf: mockedClient.address.uf,
    })

    assert.equal(response.status, 'CONFLICT')
    assert.deepEqual(response.data, { error: 'CPF already registered' })
  }).cleanup(() => Sinon.restore())

  test('email already registered', async ({ assert }) => {
    const mockedClient = await ClientFactory.with('address').with('phone').makeStubbed()

    const clientsService = new ClientsService()

    Sinon.stub(Client, 'findBy').onFirstCall().resolves(null).onSecondCall().resolves(mockedClient)

    const response = await clientsService.createClient({
      name: mockedClient.name,
      cpf: mockedClient.cpf,
      email: mockedClient.email,
      cep: mockedClient.address.cep,
      city: mockedClient.address.city,
      complement: mockedClient.address.complement ?? '',
      neighborhood: mockedClient.address.neighborhood,
      number: mockedClient.address.number,
      phone: mockedClient.phone.number,
      street: mockedClient.address.street,
      uf: mockedClient.address.uf,
    })

    assert.equal(response.status, 'CONFLICT')
    assert.deepEqual(response.data, { error: 'Email already registered' })
  }).cleanup(() => Sinon.restore())

  test('create client', async ({ assert }) => {
    const mockedClient = await ClientFactory.with('address').with('phone').makeStubbed()
    const mockedAddress = await AddressFactory.makeStubbed()
    const mockedPhone = await PhoneFactory.makeStubbed()
    mockedAddress.clientId = mockedClient.id
    mockedPhone.clientId = mockedClient.id
    mockedClient.address.merge(mockedAddress)
    mockedClient.phone.merge(mockedPhone)

    const clientsService = new ClientsService()

    Sinon.stub(Client, 'findBy').onFirstCall().resolves(null).onSecondCall().resolves(null)
    Sinon.stub(Client, 'create').resolves(mockedClient)
    Sinon.stub(Client.prototype, 'save').resolves(mockedClient)
    Sinon.stub(Address.prototype, 'save').resolves(mockedAddress)
    Sinon.stub(Phone.prototype, 'save').resolves(mockedPhone)

    const response = await clientsService.createClient({
      name: mockedClient.name,
      cpf: mockedClient.cpf,
      email: mockedClient.email,
      cep: mockedClient.address.cep,
      city: mockedClient.address.city,
      complement: mockedClient.address.complement ?? '',
      neighborhood: mockedClient.address.neighborhood,
      number: mockedClient.address.number,
      phone: mockedClient.phone.number,
      street: mockedClient.address.street,
      uf: mockedClient.address.uf,
    })

    const clientCreated = new ClientCreatedDto(
      mockedClient.id,
      mockedClient.name,
      mockedClient.email,
      FormatTransformer.formatCpf(mockedClient.cpf),
      mockedAddress.id,
      FormatTransformer.formatPhone(mockedPhone.number)
    )

    assert.equal(response.status, 'CREATED')
    assert.deepEqual(response.data, clientCreated)
  }).cleanup(() => Sinon.restore())

  test('get all clients', async ({ assert }) => {
    const mockedClients = await ClientFactory.with('address').with('phone').makeStubbedMany(3)

    const clientsService = new ClientsService()

    Sinon.stub(Client, 'query').returns({
      preload: () => ({
        preload: () => mockedClients,
      }),
    } as unknown as ModelQueryBuilderContract<typeof Client>)

    const response = await clientsService.getAllClients()

    const orderedClients = mockedClients.sort((a, b) => a.id - b.id)

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

    assert.deepEqual(response.data, clientsToReturn)
  }).cleanup(() => Sinon.restore())

  test('client not found when updating', async ({ assert }) => {
    const clientsService = new ClientsService()

    Sinon.stub(Client, 'find').resolves(null)

    const response = await clientsService.updateClient(1, {
      name: 'Test',
    })

    assert.equal(response.status, 'NOT_FOUND')
    assert.deepEqual(response.data, { error: 'Client not found' })
  }).cleanup(() => Sinon.restore())

  test('cpf already registered when updating', async ({ assert }) => {
    const clientsService = new ClientsService()

    const mockedClient = await ClientFactory.makeStubbed()

    Sinon.stub(Client, 'findBy').resolves(mockedClient)

    const response = await clientsService.updateClient(mockedClient.id + 1, {
      cpf: mockedClient.cpf,
    })

    assert.equal(response.status, 'CONFLICT')
    assert.deepEqual(response.data, { error: 'CPF already registered' })
  }).cleanup(() => Sinon.restore())

  test('email already registered when updating', async ({ assert }) => {
    const clientsService = new ClientsService()

    const mockedClient = await ClientFactory.makeStubbed()

    Sinon.stub(Client, 'findBy').resolves(mockedClient)

    const response = await clientsService.updateClient(mockedClient.id + 1, {
      email: mockedClient.email,
    })

    assert.equal(response.status, 'CONFLICT')
    assert.deepEqual(response.data, { error: 'Email already registered' })
  }).cleanup(() => Sinon.restore())

  test('update client', async ({ assert }) => {
    const NAME = 'Test'
    const STREET = 'Test'
    const PHONE = '(21) 88984-5864'

    const clientsService = new ClientsService()

    const mockedClient = await ClientFactory.with('address').with('phone').makeStubbed()
    const mockedAddress = await AddressFactory.makeStubbed()
    const mockedPhone = await PhoneFactory.makeStubbed()
    mockedAddress.clientId = mockedClient.id
    mockedPhone.clientId = mockedClient.id
    mockedClient.address.merge(mockedAddress)
    mockedClient.phone.merge(mockedPhone)

    Sinon.stub(Client, 'find').resolves(mockedClient)
    Sinon.stub(Address, 'findByOrFail').resolves(mockedAddress)
    Sinon.stub(Phone, 'findByOrFail').resolves(mockedPhone)

    mockedClient.name = NAME
    mockedAddress.street = STREET
    mockedPhone.number = FormatTransformer.unformatPhone(PHONE)

    Sinon.stub(Client.prototype, 'merge').returnsThis()
    Sinon.stub(Client.prototype, 'save').resolves(mockedClient)
    Sinon.stub(Address.prototype, 'merge').returnsThis()
    Sinon.stub(Address.prototype, 'save').resolves(mockedAddress)
    Sinon.stub(Phone.prototype, 'merge').returnsThis()
    Sinon.stub(Phone.prototype, 'save').resolves(mockedPhone)

    Sinon.stub(Client, 'findOrFail').resolves(mockedClient)

    const response = await clientsService.updateClient(mockedClient.id, {
      name: NAME,
      street: STREET,
      phone: PHONE,
    })

    const clientCreated = new ClientCreatedDto(
      mockedClient.id,
      mockedClient.name,
      mockedClient.email,
      FormatTransformer.formatCpf(mockedClient.cpf),
      mockedAddress.id,
      PHONE
    )

    assert.equal(response.status, 'OK')
    assert.deepEqual(response.data, clientCreated)
  }).cleanup(() => Sinon.restore())

  test('client not found when searching by id', async ({ assert }) => {
    Sinon.stub(Client, 'query').returns({
      where: () => ({
        preload: () => ({
          preload: () => ({
            preload: () => ({
              first: () => null,
            }),
          }),
        }),
      }),
    } as unknown as ModelQueryBuilderContract<typeof Client>)

    const clientsService = new ClientsService()

    const response = await clientsService.getClientById(1)

    assert.equal(response.status, 'NOT_FOUND')
    assert.deepEqual(response.data, { error: 'Client not found' })
  }).cleanup(() => Sinon.restore())

  test('get client by id', async ({ assert }) => {
    const mockedClient = await ClientFactory.with('address')
      .with('phone')
      .with('sales')
      .makeStubbed()

    mockedClient.sales[0].createdAt = DateTime.now()

    Sinon.stub(Client, 'query').returns({
      where: () => ({
        preload: () => ({
          preload: () => ({
            preload: () => ({
              first: () => mockedClient,
            }),
          }),
        }),
      }),
    } as unknown as ModelQueryBuilderContract<typeof Client>)

    const clientsService = new ClientsService()

    const response = await clientsService.getClientById(mockedClient.id)

    const clientAddress = new AddressClientDto(
      mockedClient.address.street,
      mockedClient.address.number,
      mockedClient.address.complement,
      mockedClient.address.neighborhood,
      FormatTransformer.formatCep(mockedClient.address.cep),
      mockedClient.address.city,
      mockedClient.address.uf.toLocaleUpperCase()
    )

    const clientPhone = new PhoneClientDto(
      mockedClient.phone.id,
      FormatTransformer.formatPhone(mockedClient.phone.number)
    )

    const clientSales = mockedClient.sales.map((sale) => {
      return {
        id: sale.id,
        productId: sale.productId,
        quantity: Number(sale.quantity),
        unitPrice: Number(sale.unitPrice),
        totalPrice: Number(sale.totalPrice),
        createdAt: FormatTransformer.formatDate(sale.createdAt),
      }
    })

    const clientWithSales = new ClientWithSales(
      mockedClient.id,
      mockedClient.name,
      mockedClient.email,
      FormatTransformer.formatCpf(mockedClient.cpf),
      clientAddress,
      clientPhone,
      clientSales
    )

    assert.equal(response.status, 'OK')
    assert.deepEqual(response.data, clientWithSales)
  }).cleanup(() => Sinon.restore())

  test('client not found when deleting', async ({ assert }) => {
    const clientsService = new ClientsService()

    Sinon.stub(Client, 'find').resolves(null)

    const response = await clientsService.deleteClient(1)

    assert.equal(response.status, 'NOT_FOUND')
    assert.deepEqual(response.data, { error: 'Client not found' })
  }).cleanup(() => Sinon.restore())

  test('delete client', async ({ assert }) => {
    const clientsService = new ClientsService()

    const mockedClient = await ClientFactory.makeStubbed()

    Sinon.stub(Client, 'find').resolves(mockedClient)
    Sinon.stub(Client.prototype, 'delete').resolves()

    const response = await clientsService.deleteClient(mockedClient.id)

    assert.equal(response.status, 'NO_CONTENT')
    assert.isNull(response.data)
  }).cleanup(() => Sinon.restore())
})
