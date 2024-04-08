/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '../start/kernel.js'
const SalesController = () => import('../app/controllers/sales_controller.js')
const ProductsController = () => import('../app/controllers/products_controller.js')
const ClientsController = () => import('../app/controllers/clients_controller.js')
const RegisterController = () => import('../app/controllers/users_controller.js')

router.post('/register', [RegisterController, 'signup'])

router.post('/login', [RegisterController, 'login'])

router.resource('/clients', ClientsController).middleware('*', middleware.auth({ guards: ['api'] }))
router.get('/clients/:id/filter', [ClientsController, 'show']).use(
  middleware.auth({
    guards: ['api'],
  })
)

router
  .resource('/products', ProductsController)
  .middleware('*', middleware.auth({ guards: ['api'] }))

router.post('/sales/:clientId', [SalesController, 'store']).use(
  middleware.auth({
    guards: ['api'],
  })
)
