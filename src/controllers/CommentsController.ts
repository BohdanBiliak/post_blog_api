import { Request, Response } from "express";
import { CommentsQueryRepository } from "../infrastructure/repositories/query-repos/comments-query-repository";
import { CommentsService } from "../application/comments-service";
import { inject, injectable } from "inversify";

@injectable()
export class CommentsController {
  constructor(
    @inject(CommentsService) protected commentsService: CommentsService,
    @inject(CommentsQueryRepository)
    protected commentsQueryRepository: CommentsQueryRepository
  ) {}
  async getComment(req: Request, res: Response) {
    const foundComment = await this.commentsQueryRepository.findCommentById(
      req.params.id,
      req.user?._id
    );
    res.json(foundComment);
  }

  async updateComment(req: Request, res: Response) {
    const isUpdated = await this.commentsService.updateComment(
      req.params.id,
      req.body
    );

    if (isUpdated) {
      const updatedComment = await this.commentsQueryRepository.findCommentById(
        req.body.id
      );
      res.status(204).json(updatedComment);
    }
  }

  async deleteComment(req: Request, res: Response) {
    const isDeleted = await this.commentsService.deleteComment(req.params.id);
    if (isDeleted) {
      res.sendStatus(204);
    }
  }

  async deleteComments(req: Request, res: Response) {
    const isDeleted = await this.commentsService.deleteAll();
    if (isDeleted) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  }

  async updateLikeStatus(req: Request, res: Response) {
    const isUpdated = await this.commentsService.updateLikeStatus(
      req.params.id,
      req.body.likeStatus,
      req.user!._id
    );

    if (isUpdated) {
      const updatedComment = await this.commentsQueryRepository.findCommentById(
        req.params.id
      );
      res.status(204).json(updatedComment);
    }
  }
}