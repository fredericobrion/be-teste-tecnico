import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { UserFactory } from '../factories/user_factory.js'

export default class extends BaseSeeder {
  static environment: string[] = ['development']
  async run() {
    // Write your database queries inside the run method
    await UserFactory.create()
  }
}
