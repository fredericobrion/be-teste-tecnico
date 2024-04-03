import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import City from './city.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class State extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare uf: string

  @hasMany(() => City)
  declare cities: HasMany<typeof City>
}
