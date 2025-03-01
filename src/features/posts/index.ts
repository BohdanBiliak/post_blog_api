import {Router} from 'express'
import {createPostController} from './controllers/createPostController'
import {getPostsController} from './controllers/getPostController'
import {findPostController} from './controllers/findPostController'
import {delPostController} from './controllers/deletePostController'
import {putPostController} from './controllers/putPostController'
import {findPostValidatorMiddleware, postValidatorMiddleware} from './middlewares/postValidator'
import {adminMiddleware} from '../../global_middlewares/admin-middleware'
import {commentController} from "../comments/controllers/commentsController";
import {authenticateJWT} from "../../global_middlewares/authJWT";
import {commentValidator} from "../comments/miidlewares/commentsValidator";

export const postsRouter = Router()

postsRouter.get('/', getPostsController)
postsRouter.get('/:id',findPostValidatorMiddleware, findPostController)
postsRouter.post('/', ...postValidatorMiddleware, createPostController)
postsRouter.delete('/:id', adminMiddleware, findPostValidatorMiddleware,delPostController)
postsRouter.put('/:id', ...postValidatorMiddleware,findPostValidatorMiddleware, putPostController)
postsRouter.post("/:postId/comments",authenticateJWT,commentValidator, commentController.create);
