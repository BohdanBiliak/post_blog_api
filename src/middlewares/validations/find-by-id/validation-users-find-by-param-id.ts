import { param } from "express-validator";
import { container } from "../../../composition-root";
import { UsersQueryRepository } from "../../../infrastructure/repositories/query-repos/users-query-repository";

const usersQueryRepository = container.get(UsersQueryRepository);

export const validationUsersFindByParamId = param("id").custom(
  async (value) => {
    const result = await usersQueryRepository.findUserById(value);
    if (!result) {
      throw new Error("ID not found");
    }
    return true;
  }
);