import { AccessToken } from '@adonisjs/auth/access_tokens'

export class UserCreatedDto {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public token: AccessToken
  ) {}
}

export class UserToCreate {
  constructor(
    public password: string,
    public name: string,
    public email: string
  ) {}
}
