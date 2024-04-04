import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import City from './city.js'
import Client from './client.js'

export default class Address extends BaseModel {
  static table = 'adresses'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare clientId: number

  @column()
  declare street: string

  @column()
  declare number: string

  @column()
  declare complement: string

  @column()
  declare neighborhood: string

  @column()
  declare cep: string

  @column()
  declare cityId: number

  @belongsTo(() => Client)
  declare user: BelongsTo<typeof Client>

  @belongsTo(() => City)
  declare city: BelongsTo<typeof City>
}
