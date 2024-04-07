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
import { ClientCreatedDto } from '../../../app/dto/client_dto.js'

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
    const mockedAddress = await AddressFactory.makeStubbed()
    const mockedPhone = await PhoneFactory.makeStubbed()
    const mockedClient = await ClientFactory.with('address').with('phone').makeStubbed()
    mockedClient.address.merge(mockedAddress)
    mockedClient.phone.merge(mockedPhone)

    const clientsService = new ClientsService()

    Sinon.stub(Client, 'findBy').onFirstCall().resolves(null).onSecondCall().resolves(null)
    Sinon.stub(Client, 'create').resolves(mockedClient)
    Sinon.stub(mockedClient, 'save').resolves(mockedClient)
    Sinon.stub(Address, 'create').resolves(mockedAddress)
    Sinon.stub(mockedAddress, 'save').resolves(mockedAddress)
    Sinon.stub(Phone, 'create').resolves(mockedPhone)
    Sinon.stub(mockedPhone, 'save').resolves(mockedPhone)

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
      mockedPhone.number
    )

    assert.equal(response.status, 'CREATED')
    assert.deepEqual(response.data, clientCreated)
  })
    .cleanup(() => Sinon.restore())
    .skip()
})
