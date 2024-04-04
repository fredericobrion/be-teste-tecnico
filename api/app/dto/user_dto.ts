export class UserCreatedDto {
  constructor(
    public id: number,
    public name: string,
    public email: string
  ) {}
}

export class UserToCreate {
  constructor(
    public password: string,
    public name: string,
    public email: string
  ) {}
}
