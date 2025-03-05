import {Router} from 'express'

import {authenticateJWT} from "../../global_middlewares/authJWT";
import {commentController} from "./controllers/commentsController";
import {commentValidator} from "./miidlewares/commentsValidator";

export const commentRouter = Router()

commentRouter.put("/:commentsId",authenticateJWT,commentValidator, commentController.update);
commentRouter.delete("/:commentsId",authenticateJWT, commentController.delete);
commentRouter.get("/:commentsId", commentController.getCommentById);