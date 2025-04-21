import { ObjectId } from "mongodb";
import { UserViewModel } from "../models/view/UserViewModel";
import { UsersRepository } from "../infrastructure/repositories/users-repository";
import bcrypt from "bcrypt";
import { UserDBModel } from "../models/database/UserDBModel";
import { inject, injectable } from "inversify";

@injectable()
export class UsersService {
  constructor(
    @inject(UsersRepository) protected usersRepository: UsersRepository
  ) {}
  async findUserById(_id: ObjectId): Promise<UserDBModel | null> {
    return this.usersRepository.findUserById(_id);
  }

  async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserDBModel | null> {
    return this.usersRepository.findUserByLoginOrEmail(loginOrEmail);
  }

  async findUserByEmailConfirmationCode(code: string): Promise<UserDBModel | null> {
    return this.usersRepository.findUserByEmailConfirmationCode(code);
  }

  async findUserByPasswordRecoveryCode(
    recoveryCode: string
  ): Promise<UserDBModel | null> {
    return this.usersRepository.findUserByPasswordRecoveryCode(recoveryCode);
  }

  async createUser(
    login: string,
    password: string,
    email: string
  ): Promise<UserViewModel> {
    const hash = await bcrypt.hash(password, 10);
    const newUser = new UserDBModel(
      new ObjectId(),
      {
        login,
        password: hash,
        email,
        createdAt: new Date().toISOString(),
        isMembership: false,
      },
      {
        confirmationCode: null,
        expirationDate: null,
        isConfirmed: true,
      },
      {
        recoveryCode: null,
        expirationDate: null,
      }
    );

    return this.usersRepository.createUser(newUser);
  }

  async checkCredentials(
    loginOrEmail: string,
    password: string
  ): Promise<boolean> {
    const user = await this.usersRepository.findUserByLoginOrEmail(
      loginOrEmail
    );

    if (!user || !user.emailConfirmation.isConfirmed) {
      return false;
    }
    return bcrypt.compare(password, user.accountData.password);
  }

  async deleteUser(_id: ObjectId): Promise<boolean> {
    return this.usersRepository.deleteUser(_id);
  }

  async deleteAll(): Promise<boolean> {
    return this.usersRepository.deleteAll();
  }
}