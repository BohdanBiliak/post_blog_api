import {Router} from 'express'
import {createPostController} from './controllers/createPostController'
import {getPostsController} from './controllers/getPostController'
import {findPostController} from './controllers/findPostController'
import {delPostController} from './controllers/deletePostController'
import {putPostController} from './controllers/putPostController'
import {findPostValidatorMiddleware, postValidatorMiddleware} from './middlewares/postValidator'
import {adminMiddleware} from '../../global_middlewares/admin-middleware'

export const postsRouter = Router()

postsRouter.post('/', ...postValidatorMiddleware, createPostController)
postsRouter.get('/', getPostsController)
postsRouter.get('/:id',findPostValidatorMiddleware, findPostController)
postsRouter.delete('/:id',findPostValidatorMiddleware, adminMiddleware, delPostController)
postsRouter.put('/:id', findPostValidatorMiddleware,...postValidatorMiddleware, putPostController)