import { body } from "express-validator";
import { container } from "../../composition-root";
import { UsersService } from "../../application/users-service";

const usersService = container.get(UsersService);

export const validationUserUnique = (field: string) =>
  body(field).custom(async (value) => {
    const result = await usersService.findUserByLoginOrEmail(value);
    if (result) {
        throw {
            msg: "User already registered",
            param: "recoveryCode",
        };
    }
    return true;
  });