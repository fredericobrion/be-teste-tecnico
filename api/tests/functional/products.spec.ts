import { test } from '@japa/runner'
import ProductService from '../../app/services/product_service.js'
import { ServiceResponse } from '../../app/types/service_response.js'
import app from '@adonisjs/core/services/app'
import User from '../../app/models/user.js'
import { UserFactory } from '../../database/factories/user_factory.js'
import { AccessToken } from '@adonisjs/auth/access_tokens'

test.group('Products', () => {
  test('create product without token', async ({ client }) => {
    const response = await client.post('/products').form({
      name: 'product',
      description: 'description',
      price: 10,
    })
    response.assertStatus(401)
  })
})
