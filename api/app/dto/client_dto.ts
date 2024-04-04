export class ClientToCreate {
  name: string
  email: string
  cpf: string
  street: string
  number: string
  complement: string
  neighborhood: string
  cep: string
  city: string
  uf: string
  phone: string

  constructor(
    name: string,
    email: string,
    cpf: string,
    street: string,
    number: string,
    complement: string,
    neighborhood: string,
    cep: string,
    city: string,
    uf: string,
    phone: string
  ) {
    this.name = name
    this.email = email
    this.cpf = cpf
    this.street = street
    this.number = number
    this.complement = complement
    this.neighborhood = neighborhood
    this.cep = cep
    this.city = city
    this.uf = uf
    this.phone = phone
  }
}

export class ClientCreatedDto {
  id: number
  name: string
  email: string
  cpf: string
  addressId: number
  phone: string

  constructor(
    id: number,
    name: string,
    email: string,
    cpf: string,
    addressId: number,
    phone: string
  ) {
    this.id = id
    this.name = name
    this.email = email
    this.cpf = cpf
    this.addressId = addressId
    this.phone = phone
  }
}
