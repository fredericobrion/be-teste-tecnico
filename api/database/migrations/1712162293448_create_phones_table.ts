import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'phones'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .integer('client_id')
        .unsigned()
        .unique()
        .references('clients.id')
        .onDelete('CASCADE')
        .notNullable()
      table.string('number', 11).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
