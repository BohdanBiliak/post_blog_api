import { BlogsRepository } from "../infrastructure/repositories/blogs-repository";
import { BlogDBModel } from "../models/database/BlogDBModel";
import { ObjectId } from "mongodb";
import { BlogViewModel } from "../models/view/BlogViewModel";
import { inject, injectable } from "inversify";

@injectable()
export class BlogsService {
  constructor(
    @inject(BlogsRepository) protected blogsRepository: BlogsRepository
  ) {}

  async createBlog(
    name: string,
    description: string,
    websiteUrl: string
  ): Promise<BlogViewModel> {
    const newBlog = new BlogDBModel(
      new ObjectId(),
      name,
      description,
      websiteUrl,
      new Date().toISOString(),
      false
    );

    return this.blogsRepository.createBlog(newBlog);
  }

  async updateBlog(_id: string, blog: BlogDBModel): Promise<boolean> {
    return this.blogsRepository.updateBlog(
      _id,
      blog.name,
      blog.description,
      blog.websiteUrl
    );
  }

  async deleteBlog(_id: string): Promise<boolean> {
    return this.blogsRepository.deleteBlog(_id);
  }

  async deleteAll(): Promise<boolean> {
    return this.blogsRepository.deleteAll();
  }
}