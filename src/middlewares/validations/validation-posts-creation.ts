import { body } from "express-validator";
import { container } from "../../composition-root";
import { BlogsQueryRepository } from "../../infrastructure/repositories/query-repos/blogs-query-repository";

const blogsQueryRepository = container.get(BlogsQueryRepository);

export const validationPostsCreation = body("blogId").custom(async (value) => {
  const result = await blogsQueryRepository.findBlogById(value);
  if (!result) {
    throw new Error("Blog with provided ID not found");
  }
  return true;
});