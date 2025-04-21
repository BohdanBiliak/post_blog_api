import { Router } from "express";
import { validationErrorCheck } from "../middlewares/validations/_validation-error-check";
import { validationUsersInput } from "../middlewares/validations/input/validation-users-input";
import { validationUsersFindByParamId } from "../middlewares/validations/find-by-id/validation-users-find-by-param-id";
import { validationUserUnique } from "../middlewares/validations/validation-user-unique";
import { authBasic } from "../middlewares/auth/auth-basic";
import { container } from "../composition-root";
import { UsersController } from "../controllers/UsersController";

export const usersRouter = Router({});

const usersController = container.get(UsersController);

usersRouter.post(
  "/",
  authBasic,
  validationUserUnique("login"),
  validationUserUnique("email"),
  validationUsersInput,
  validationErrorCheck,
  usersController.createUser.bind(usersController)
);

usersRouter.get("/", authBasic, usersController.getUsers.bind(usersController));

usersRouter.delete(
  "/:id",
  authBasic,
  validationUsersFindByParamId,
  validationErrorCheck,
  usersController.deleteUser.bind(usersController)
);

usersRouter.delete(
  "/",
  authBasic,
  usersController.deleteUsers.bind(usersController)
);