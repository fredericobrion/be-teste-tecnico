import { BaseModel, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import Address from './address.js'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import Phone from './phone.js'
import Sale from './sale.js'

export default class Client extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare email: string

  @column()
  declare cpf: string

  @hasOne(() => Address)
  declare address: HasOne<typeof Address>

  @hasOne(() => Phone)
  declare phones: HasOne<typeof Phone>

  @hasMany(() => Sale)
  declare sales: HasMany<typeof Sale>
}
