import { BlogViewModel } from "../../../models/view/BlogViewModel";
import { Paginator } from "../../../models/view/_Paginator";
import { BlogMongooseModel } from "../../../domain/BlogSchema";
import { BlogDBModel } from "../../../models/database/BlogDBModel";
import { FilterQuery, SortOrder } from "mongoose";
import { injectable } from "inversify";

@injectable()
export class BlogsQueryRepository {
  async findBlogs(
    pageNumber: number,
    pageSize: number,
    sortBy: string = "createdAt",
    sortDirection: SortOrder,
    searchNameTerm?: string
  ): Promise<Paginator<BlogViewModel[]>> {
    const filter: FilterQuery<BlogDBModel> = {};

    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: "i" };
    }

    const sortingObj: { [key: string]: SortOrder } = { [sortBy]: "desc" };

    if (sortDirection === "asc") {
      sortingObj[sortBy] = "asc";
    }

    const blogs = await BlogMongooseModel.find(filter)
      .sort(sortingObj)
      .skip(pageNumber > 0 ? (pageNumber - 1) * pageSize : 0)
      .limit(pageSize > 0 ? pageSize : 0)
      .lean();

    const totalCount = await BlogMongooseModel.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount,
      items: await this.blogsMapping(blogs),
    };
  }

  async findBlogById(_id: string): Promise<BlogViewModel | null> {
    const foundBlog = await BlogMongooseModel.findOne({ _id });

    if (!foundBlog) {
      return null;
    }

    return {
      id: foundBlog._id.toString(),
      name: foundBlog.name,
      description: foundBlog.description,
      websiteUrl: foundBlog.websiteUrl,
      createdAt: foundBlog.createdAt,
      isMembership: foundBlog.isMembership,
    };
  }

  private async blogsMapping(array: BlogDBModel[]): Promise<BlogViewModel[]> {
    return array.map((blog) => {
      return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
      };
    });
  }
}