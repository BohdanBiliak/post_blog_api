import { body } from "express-validator";
import { container } from "../../composition-root";
import { UsersService } from "../../application/users-service";

const usersService = container.get(UsersService);

export const validationPasswordConfirm = body("recoveryCode").custom(
  async (value) => {
    const user = await usersService.findUserByPasswordRecoveryCode(value);
    if (
      !user ||
      user.passwordRecovery.recoveryCode !== value ||
      user.passwordRecovery.expirationDate! < new Date()
    ) {
        throw {
            msg: "Recovery code is incorrect",
            param: "recoveryCode",
        };
    }
    return true;
  }
);