import { body } from "express-validator";
import { container } from "../../composition-root";
import { UsersService } from "../../application/users-service";

const usersService = container.get(UsersService);

export const validationEmailConfirm = body("code").custom(async (value) => {
  const user = await usersService.findUserByEmailConfirmationCode(value);
  if (
    !user ||
    user.emailConfirmation.isConfirmed ||
    user.emailConfirmation.confirmationCode !== value ||
    user.emailConfirmation.expirationDate! < new Date()
  ) {
    throw {
      msg: "Conf code is incorrect",
      param: "recoveryCode",
    };
  }
  return true;
});