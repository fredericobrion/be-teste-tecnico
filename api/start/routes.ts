/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const RegisterController = () => import('../app/controllers/register_controller.js')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post('/register', [RegisterController, 'signup'])
