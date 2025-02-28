import {Router} from 'express'

import {authenticateJWT} from "../../global_middlewares/authJWT";
import {commentController} from "./controllers/commentsController";

export const commentRouter = Router()

commentRouter.put("/:commentsId",authenticateJWT, commentController.update);
commentRouter.delete("/:commentsId",authenticateJWT, commentController.delete);
