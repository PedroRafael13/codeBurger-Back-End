import { Router } from 'express'
import multer from 'multer'
import multerConfig from './config/multer'
import authMiddlewarews from './app/middlewares/auth'

import ProductsController from './app/controller/ProductsController'
import UserController from './app/controller/UserController'
import UserControllerSessions from './app/controller/UserControllerSessions'
import CategoryController from './app/controller/CategoryController'

const upload = multer(multerConfig)
const routes = new Router()

routes.post('/users',UserController.store)

routes.post('/sessions',UserControllerSessions.store)

routes.use(authMiddlewarews)

routes.post('/products', upload.single('file'),ProductsController.store)
routes.get('/products',ProductsController.index)

routes.post('/categories', CategoryController.store)
routes.get('/categories', CategoryController.index)

export default routes