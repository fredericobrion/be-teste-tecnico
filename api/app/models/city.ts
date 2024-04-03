import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import State from './state.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Address from './address.js'

export default class City extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare stateId: number

  @belongsTo(() => State)
  declare state: BelongsTo<typeof State>

  @hasMany(() => Address)
  declare addresses: HasMany<typeof Address>
}
