import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import City from './city.js'

export default class Address extends BaseModel {
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

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => City)
  declare city: BelongsTo<typeof City>
}
