import { Request, Response } from "express";
import { PostsService } from "../application/posts-service";
import {
  RequestWithParamsAndQuery,
  RequestWithQuery,
} from "../types/request-types";
import { QueryModel } from "../models/global/QueryModel";
import { PostsQueryRepository } from "../infrastructure/repositories/query-repos/posts-query-repository";
import { SortOrder } from "mongoose";
import { CommentsService } from "../application/comments-service";
import { StringIdModel } from "../models/global/StringIdModel";
import { CommentsQueryRepository } from "../infrastructure/repositories/query-repos/comments-query-repository";
import { inject, injectable } from "inversify";

@injectable()
export class PostsController {
  constructor(
    @inject(PostsService) protected postsService: PostsService,
    @inject(CommentsService) protected commentsService: CommentsService,
    @inject(PostsQueryRepository)
    protected postsQueryRepository: PostsQueryRepository,
    @inject(CommentsQueryRepository)
    protected commentsQueryRepository: CommentsQueryRepository
  ) {}
  async createPost(req: Request, res: Response) {
    const newPost = await this.postsService.createPost(
      req.body.title,
      req.body.shortDescription,
      req.body.content,
      req.body.blogId
    );
    res.status(201).json(newPost);
  }

  async getPosts(req: RequestWithQuery<QueryModel>, res: Response) {
    const foundPosts = await this.postsQueryRepository.findPosts(
      Number(req.query.pageNumber) || 1,
      Number(req.query.pageSize) || 10,
      req.query.sortBy,
      req.query.sortDirection as SortOrder,
      req.user?._id
    );
    res.json(foundPosts);
  }

  async getPost(req: Request, res: Response) {
    const foundPost = await this.postsQueryRepository.findPostById(
      req.params.id,
      req.user?._id
    );
    res.json(foundPost);
  }

  async updatePost(req: Request, res: Response) {
    const isUpdated = await this.postsService.updatePost(
      req.params.id,
      req.body
    );

    if (isUpdated) {
      const updatedPost = await this.postsQueryRepository.findPostById(
        req.body.id
      );
      res.status(204).json(updatedPost);
    }
  }

  async deletePost(req: Request, res: Response) {
    const isDeleted = await this.postsService.deletePost(req.params.id);
    if (isDeleted) {
      res.sendStatus(204);
    }
  }

  async deletePosts(req: Request, res: Response) {
    const isDeleted = await this.postsService.deleteAll();
    if (isDeleted) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  }

  async createComment(req: Request, res: Response) {
    const newComment = await this.commentsService.createComment(
      req.params.id,
      req.body.content,
      req.user!._id
    );
    res.status(201).json(newComment);
  }

  async getComments(
    req: RequestWithParamsAndQuery<StringIdModel, QueryModel>,
    res: Response
  ) {
    const foundComments = await this.commentsQueryRepository.findComments(
      Number(req.query.pageNumber) || 1,
      Number(req.query.pageSize) || 10,
      req.query.sortBy,
      req.query.sortDirection as SortOrder,
      req.params.id,
      req.user?._id
    );
    res.json(foundComments);
  }

  async updateLikeStatus(req: Request, res: Response) {
    const isUpdated = await this.postsService.updateLikeStatus(
      req.params.id,
      req.body.likeStatus,
      req.user!._id
    );

    if (isUpdated) {
      const updatedComment = await this.postsQueryRepository.findPostById(
        req.params.id
      );
      res.status(204).json(updatedComment);
    }
  }
}