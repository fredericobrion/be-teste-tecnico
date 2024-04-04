export class AddressClientDto {
  constructor(
    public street: string,
    public number: string,
    public complement: string,
    public neighborhood: string,
    public cep: string,
    public city: string,
    public uf: string
  ) {}
}
