import { Request, Response } from "express";
import { BlogsRepository } from "../infrastructure/repositories/blogs-repository";
import { PostsRepository } from "../infrastructure/repositories/posts-repository";
import { UsersRepository } from "../infrastructure/repositories/users-repository";
import { CommentsRepository } from "../infrastructure/repositories/comments-repository";
import { DevicesRepository } from "../infrastructure/repositories/devices-repository";
import { RateLimitsRepository } from "../infrastructure/repositories/rate-limits-repository";
import { inject, injectable } from "inversify";

@injectable()
export class TestingController {
  constructor(
    @inject(BlogsRepository) protected blogsRepository: BlogsRepository,
    @inject(PostsRepository) protected postsRepository: PostsRepository,
    @inject(UsersRepository) protected usersRepository: UsersRepository,
    @inject(CommentsRepository)
    protected commentsRepository: CommentsRepository,
    @inject(DevicesRepository) protected devicesRepository: DevicesRepository,
    @inject(RateLimitsRepository)
    protected rateLimitsRepository: RateLimitsRepository
  ) {}
  async deleteEverything(req: Request, res: Response) {
    await this.blogsRepository.deleteAll();
    await this.postsRepository.deleteAll();
    await this.usersRepository.deleteAll();
    await this.commentsRepository.deleteAll();
    await this.devicesRepository.deleteAll();
    await this.rateLimitsRepository.deleteAll();
    res.sendStatus(204);
  }
}