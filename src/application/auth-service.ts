import { emailManager } from "./email-manager";
import { UserViewModel } from "../models/view/UserViewModel";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { add } from "date-fns";
import { UsersRepository } from "../infrastructure/repositories/users-repository";
import { UsersService } from "./users-service";
import { inject, injectable } from "inversify";
import { UserMongooseModel } from "../domain/UserSchema";

@injectable()
export class AuthService {
  constructor(
    @inject(UsersService) protected usersService: UsersService,
    @inject(UsersRepository) protected usersRepository: UsersRepository
  ) {}
  async registerUser(
    login: string,
    password: string,
    email: string
  ): Promise<UserViewModel | null> {
    const hash = await bcrypt.hash(password, 10);

    const smartUserModel = await UserMongooseModel.makeInstance(
      login,
      hash,
      email
    );
    const createResult = await this.usersRepository.save(smartUserModel);

    try {
      await emailManager.sendRegistrationEmail(
        smartUserModel.accountData.email,
        smartUserModel.emailConfirmation.confirmationCode!
      );
    } catch (error) {
      console.error(error);
      await this.usersRepository.deleteUser(smartUserModel._id);
      return null;
    }

    return createResult;
  }

  async confirmEmail(code: string): Promise<boolean> {
    const user = await this.usersRepository.findUserByEmailConfirmationCode(
      code
    );

    if (!user) {
      return false;
    }

    if (user.canBeConfirmed(code)) {
      user.confirm(code);
      return this.usersRepository.save(user);
    }

    return false;
  }

  async resendEmail(email: string): Promise<boolean> {
    const user = await this.usersService.findUserByLoginOrEmail(email);
    if (!user || !user.emailConfirmation.confirmationCode) {
      return false;
    }
    const newConfirmationCode = randomUUID();
    try {
      await emailManager.sendRegistrationEmail(
        user.accountData.email,
        newConfirmationCode
      );
    } catch (error) {
      console.error(error);
      return false;
    }
    return this.usersRepository.updateEmailConfirmationCode(
      user._id,
      newConfirmationCode
    );
  }

  async sendPasswordRecoveryCode(email: string): Promise<boolean> {
    const user = await this.usersService.findUserByLoginOrEmail(email);

    if (!user) {
      return false;
    }

    const userId = user._id;
    const recoveryCode = randomUUID();
    const expirationDate = add(new Date(), {
      hours: 1,
    });

    const updateResult = await this.usersRepository.updatePasswordRecoveryData(
      userId,
      recoveryCode,
      expirationDate
    );

    try {
      await emailManager.sendChangePasswordEmail(email, recoveryCode);
    } catch (error) {
      console.error(error);
      return false;
    }

    return updateResult;
  }

  async changePassword(
    recoveryCode: string,
    password: string
  ): Promise<boolean> {
    const hash = await bcrypt.hash(password, 10);
    const user = await this.usersService.findUserByPasswordRecoveryCode(
      recoveryCode
    );
    if (!user) {
      return false;
    }
    return this.usersRepository.updatePassword(user._id, hash);
  }
}