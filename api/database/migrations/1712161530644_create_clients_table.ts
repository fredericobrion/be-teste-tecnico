import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'clients'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('name', 255).notNullable()
      table.string('email', 255).notNullable().unique()
      table.string('cpf', 11).notNullable().unique()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
