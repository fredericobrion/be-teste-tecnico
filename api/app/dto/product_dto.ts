export class ProductToCreate {
  constructor(
    public name: string,
    public description: string,
    public price: number
  ) {}
}

export class ProductCreatedOrUpdated {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public price: number
  ) {}
}

export class ProductSummary {
  constructor(
    public id: number,
    public name: string,
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
