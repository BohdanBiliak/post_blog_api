import { NextFunction, Request, Response } from "express";
import { container } from "../../composition-root";
import { CommentsQueryRepository } from "../../infrastructure/repositories/query-repos/comments-query-repository";

const commentsQueryRepository = container.get(CommentsQueryRepository);

export const validationCommentOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const foundComment = await commentsQueryRepository.findCommentById(
    req.params.id
  );
  if (
    foundComment &&
    foundComment.commentatorInfo.userId === req.user!._id.toString()
  ) {
    next();
  } else {
    res.sendStatus(403);
  }
};