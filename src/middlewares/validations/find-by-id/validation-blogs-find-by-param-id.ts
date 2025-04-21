import { param } from "express-validator";
import { container } from "../../../composition-root";
import { BlogsQueryRepository } from "../../../infrastructure/repositories/query-repos/blogs-query-repository";

const blogsQueryRepository = container.get(BlogsQueryRepository);

export const validationBlogsFindByParamId = param("id").custom(
  async (value) => {
    const result = await blogsQueryRepository.findBlogById(value);
    if (!result) {
      throw new Error("ID not found");
    }
    return true;
  }
);