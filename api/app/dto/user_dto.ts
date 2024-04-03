export class UserCreatedDto {
  id: number
  name: string
  email: string

  constructor(id: number, name: string, email: string) {
    this.id = id
    this.name = name
    this.email = email
  }
}

export class UserToCreate {
  password: string
  name: string
  email: string

  constructor(password: string, name: string, email: string) {
    this.password = password
    this.name = name
    this.email = email
  }
}
