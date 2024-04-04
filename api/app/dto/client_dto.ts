export class ClientToCreate {
  constructor(
    public name: string,
    public email: string,
    public cpf: string,
    public street: string,
    public number: string,
    public complement: string,
    public neighborhood: string,
    public cep: string,
    public city: string,
    public uf: string,
    public phone: string
  ) {}
}

export class ClientCreatedDto {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public cpf: string,
    public addressId: number,
    public phone: string
  ) {}
}

export class ClientToUpdate {
  constructor(
    public name?: string | null,
    public email?: string | null,
    public cpf?: string | null,
    public street?: string | null,
    public number?: string | null,
    public complement?: string | null,
    public neighborhood?: string | null,
    public cep?: string | null,
    public city?: string | null,
    public uf?: string | null,
    public phone?: string | null
  ) {}
}
