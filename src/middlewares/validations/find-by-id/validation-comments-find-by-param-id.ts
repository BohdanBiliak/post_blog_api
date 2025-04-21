import { param } from "express-validator";
import { container } from "../../../composition-root";
import { CommentsQueryRepository } from "../../../infrastructure/repositories/query-repos/comments-query-repository";

const commentsQueryRepository = container.get(CommentsQueryRepository);

export const validationCommentsFindByParamId = param("id").custom(
  async (value) => {
    const result = await commentsQueryRepository.findCommentById(value);
    if (!result) {
      throw new Error("ID not found");
    }
    return true;
  }
);