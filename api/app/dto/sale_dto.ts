export class SaleCreated {
  constructor(
    public id: number,
    public clientId: number,
    public productId: number,
    public quantity: number,
    public unitPrice: number,
    public totalPrice: number,
    public createdAt: string
  ) {}
}
