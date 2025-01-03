import {Router} from 'express'
import {createPostController} from './controllers/createPostController'
import {getPostsController} from './controllers/getPostController'
import {findPostController} from './controllers/findPostController'
import {delPostController} from './controllers/deletePostController'
import {putPostController} from './controllers/putPostController'
import {findPostValidatorMiddleware, postValidatorMiddleware} from './middlewares/postValidator'
import {adminMiddleware} from '../../global_middlewares/admin-middleware'

export const postsRouter = Router()

postsRouter.get('/', getPostsController)
postsRouter.get('/:id',findPostValidatorMiddleware, findPostController)
postsRouter.post('/', ...postValidatorMiddleware, createPostController)
postsRouter.delete('/:id', adminMiddleware, findPostValidatorMiddleware,delPostController)
postsRouter.put('/:id', ...postValidatorMiddleware,findPostValidatorMiddleware, putPostController)