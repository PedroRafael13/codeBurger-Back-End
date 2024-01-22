import { Router } from 'express'
import multer from 'multer'
import multerConfig from './config/multer'
import authMiddlewarews from './app/middlewares/auth'

import ProductsController from './app/controller/ProductsController'
import UserController from './app/controller/UserController'
import UserControllerSessions from './app/controller/UserControllerSessions'
import CategoryController from './app/controller/CategoryController'
import OrderController from './app/controller/OrderController'

const upload = multer(multerConfig)
const routes = new Router()

routes.post('/users',UserController.store)

routes.post('/sessions',UserControllerSessions.store)

routes.use(authMiddlewarews)

routes.post('/products', upload.single('file'),ProductsController.store)
routes.get('/products',ProductsController.index)
routes.put('/products/:id',upload.single('file'),ProductsController.update)

routes.post('/categories',  upload.single('file') , CategoryController.store)
routes.get('/categories', CategoryController.index)
routes.put('/categories/:id', upload.single('file'), CategoryController.update)

routes.post('/order', OrderController.store)
routes.put('/order/:id', OrderController.update)
routes.get('/order', OrderController.index)

export default routes