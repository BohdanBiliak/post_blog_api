import { Router } from "express";
import { validationErrorCheck } from "../middlewares/validations/_validation-error-check";
import { validationCommentsFindByParamId } from "../middlewares/validations/find-by-id/validation-comments-find-by-param-id";
import { validationCommentsInput } from "../middlewares/validations/input/validation-comments-input";
import { authBearer } from "../middlewares/auth/auth-bearer";
import { validationCommentOwner } from "../middlewares/validations/validation-comment-owner";
import { authBasic } from "../middlewares/auth/auth-basic";
import { validationLikesInput } from "../middlewares/validations/input/validation-likes-input";
import { tokenParser } from "../middlewares/auth/token-parser";
import { container } from "../composition-root";
import { CommentsController } from "../controllers/CommentsController";

export const commentsRouter = Router({});

const commentsController = container.get(CommentsController);

commentsRouter.get(
  "/:id",
  tokenParser,
  validationCommentsFindByParamId,
  validationErrorCheck,
  commentsController.getComment.bind(commentsController)
);

commentsRouter.put(
  "/:id",
  validationCommentsFindByParamId,
  authBearer,
  validationCommentsInput,
  validationErrorCheck,
  validationCommentOwner,
  commentsController.updateComment.bind(commentsController)
);

commentsRouter.delete(
  "/:id",
  validationCommentsFindByParamId,
  validationErrorCheck,
  authBearer,
  validationCommentOwner,
  commentsController.deleteComment.bind(commentsController)
);

commentsRouter.delete(
  "/",
  authBasic,
  commentsController.deleteComments.bind(commentsController)
);

// +++++ Likes in comments section start +++++

commentsRouter.put(
  "/:id/like-status",
  validationCommentsFindByParamId,
  authBearer,
  validationLikesInput,
  validationErrorCheck,
  commentsController.updateLikeStatus.bind(commentsController)
);

// ----- Likes in comments section end -----