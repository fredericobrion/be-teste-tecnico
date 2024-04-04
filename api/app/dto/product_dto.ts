export class ProductToCreate {
  constructor(
    public name: string,
    public description: string,
    public price: number
  ) {}
}

export class ProductToUpdate {
  constructor(
    public name?: string,
    public description?: string,
    public price?: number
  ) {}
}
