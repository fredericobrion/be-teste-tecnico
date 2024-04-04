import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'adresses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .integer('client_id')
        .unsigned()
        .references('clients.id')
        .onDelete('CASCADE')
        .notNullable()
      table.string('street', 255).notNullable()
      table.string('number', 10).notNullable()
      table.string('complement', 255)
      table.string('neighborhood', 255).notNullable()
      table.string('cep', 8).notNullable()
      table.string('city', 255).notNullable()
      table.string('uf', 2).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
