/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const ClientsController = () => import('../app/controllers/clients_controller.js')
const RegisterController = () => import('../app/controllers/user_controller.js')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post('/register', [RegisterController, 'signup'])

router.get('/clients', [ClientsController, 'index'])
router.post('/clients', [ClientsController, 'store'])
