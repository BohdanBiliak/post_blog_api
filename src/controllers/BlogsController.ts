import { Request, Response } from "express";
import { BlogsService } from "../application/blogs-service";
import {
  RequestWithParamsAndQuery,
  RequestWithQuery,
} from "../types/request-types";
import { QueryModel } from "../models/global/QueryModel";
import { BlogsQueryRepository } from "../infrastructure/repositories/query-repos/blogs-query-repository";
import { SortOrder } from "mongoose";
import { PostsService } from "../application/posts-service";
import { StringIdModel } from "../models/global/StringIdModel";
import { PostsQueryRepository } from "../infrastructure/repositories/query-repos/posts-query-repository";
import { inject, injectable } from "inversify";

@injectable()
export class BlogsController {
  constructor(
    @inject(BlogsService) protected blogsService: BlogsService,
    @inject(PostsService) protected postsService: PostsService,
    @inject(BlogsQueryRepository)
    protected blogsQueryRepository: BlogsQueryRepository,
    @inject(PostsQueryRepository)
    protected postsQueryRepository: PostsQueryRepository
  ) {}
  async createBlog(req: Request, res: Response) {
    const newBlog = await this.blogsService.createBlog(
      req.body.name,
      req.body.description,
      req.body.websiteUrl
    );
    res.status(201).json(newBlog);
  }

  async getBlogs(req: RequestWithQuery<QueryModel>, res: Response) {
    const foundBlogs = await this.blogsQueryRepository.findBlogs(
      Number(req.query.pageNumber) || 1,
      Number(req.query.pageSize) || 10,
      req.query.sortBy,
      req.query.sortDirection as SortOrder,
      req.query.searchNameTerm
    );
    res.json(foundBlogs);
  }

  async getBlog(req: Request, res: Response) {
    const foundBlog = await this.blogsQueryRepository.findBlogById(
      req.params.id
    );
    res.json(foundBlog);
  }
  async updateBlog(req: Request, res: Response) {
    const isUpdated = await this.blogsService.updateBlog(
      req.params.id,
      req.body
    );
    if (isUpdated) {
      const updatedBlog = await this.blogsQueryRepository.findBlogById(
        req.body.id
      );
      res.status(204).json(updatedBlog);
    }
  }

  async deleteBlog(req: Request, res: Response) {
    const isDeleted = await this.blogsService.deleteBlog(req.params.id);
    if (isDeleted) {
      res.sendStatus(204);
    }
  }

  async deleteBlogs(req: Request, res: Response) {
    const isDeleted = await this.blogsService.deleteAll();
    if (isDeleted) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  }

  async createPost(req: Request, res: Response) {
    const newPost = await this.postsService.createPost(
      req.body.title,
      req.body.shortDescription,
      req.body.content,
      req.params.id
    );
    res.status(201).json(newPost);
  }

  async getPosts(
    req: RequestWithParamsAndQuery<StringIdModel, QueryModel>,
    res: Response
  ) {
    const foundPosts = await this.postsQueryRepository.findPosts(
      Number(req.query.pageNumber) || 1,
      Number(req.query.pageSize) || 10,
      req.query.sortBy,
      req.query.sortDirection as SortOrder,
      req.user?._id,
      req.params.id
    );
    res.json(foundPosts);
  }
}