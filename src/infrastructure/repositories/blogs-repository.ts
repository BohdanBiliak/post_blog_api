import { BlogDBModel } from "../../models/database/BlogDBModel";
import { BlogViewModel } from "../../models/view/BlogViewModel";
import { BlogMongooseModel } from "../../domain/BlogSchema";
import { injectable } from "inversify";
import { HydratedDocument } from "mongoose";

@injectable()
export class BlogsRepository {
  async createBlog(newBlog: BlogDBModel): Promise<BlogViewModel> {
    const insertedBlog = await BlogMongooseModel.create(newBlog);
    return {
      id: insertedBlog._id.toString(),
      name: newBlog.name,
      description: newBlog.description,
      websiteUrl: newBlog.websiteUrl,
      createdAt: newBlog.createdAt,
      isMembership: newBlog.isMembership,
    };
  }

  async updateBlog(
    _id: string,
    name: string,
    description: string,
    websiteUrl: string
  ): Promise<boolean> {
    const result = await BlogMongooseModel.updateOne(
      { _id },
      {
        $set: {
          name: name,
          description: description,
          websiteUrl: websiteUrl,
        },
      }
    );
    return result.matchedCount === 1;
  }

  async deleteBlog(_id: string): Promise<boolean> {
    const result = await BlogMongooseModel.deleteOne({ _id });
    return result.deletedCount === 1;
  }

  async deleteAll(): Promise<boolean> {
    await BlogMongooseModel.deleteMany({});
    return (await BlogMongooseModel.countDocuments()) === 0;
  }

  async findBlogById(
    _id: string
  ): Promise<HydratedDocument<BlogDBModel> | null> {
    return BlogMongooseModel.findOne({ _id });
  }
}