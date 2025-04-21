import { Model, Schema, HydratedDocument, model } from "mongoose";
import { ObjectId } from "mongodb";
import { randomUUID } from "crypto";
import { add } from "date-fns";

export interface IUser {
  accountData: {
    login: string;
    password: string;
    email: string;
    createdAt: string;
    isMembership: boolean;
  };
  emailConfirmation: {
    confirmationCode: string | null;
    expirationDate: Date | null;
    isConfirmed: boolean;
  };
  passwordRecovery: {
    recoveryCode: string | null;
    expirationDate: Date | null;
  };
}

export interface IUserMethods {
  canBeConfirmed(code: string): boolean;
  confirm(code: string): void;
}

export interface UserModel extends Model<IUser, {}, IUserMethods> {
  makeInstance(
    login: string,
    hash: string,
    email: string
  ): Promise<HydratedDocument<IUser, IUserMethods>>;
}

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
  accountData: {
    login: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    createdAt: { type: String, required: true },
    isMembership: { type: Boolean, required: true },
  },
  emailConfirmation: {
    confirmationCode: String,
    expirationDate: Date,
    isConfirmed: { type: Boolean, required: true },
  },
  passwordRecovery: {
    recoveryCode: String,
    expirationDate: Date,
  },
});
userSchema.method("canBeConfirmed", function canBeConfirmed(code: string) {
  const that = this as IUser;
  return (
    !that.emailConfirmation.isConfirmed &&
    that.emailConfirmation.confirmationCode === code &&
    that.emailConfirmation.expirationDate! > new Date()
  );
});
userSchema.method("confirm", function confirm(code: string) {
  const that = this as IUser & IUserMethods;

  if (!that.canBeConfirmed(code)) {
    throw new Error(`Invalid confirmation data`);
  }

  if (that.emailConfirmation.isConfirmed) {
    throw new Error("User is already confirmed");
  }
  that.emailConfirmation.isConfirmed = true;
});

userSchema.static(
  "makeInstance",
  function makeInstance(login: string, hash: string, email: string) {
    return this.create({
      _id: new ObjectId(),
      accountData: {
        login,
        password: hash,
        email,
        createdAt: new Date().toISOString(),
        isMembership: false,
      },
      emailConfirmation: {
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), {
          hours: 1,
        }),
        isConfirmed: false,
      },
      passwordRecovery: {
        recoveryCode: null,
        expirationDate: null,
      },
    });
  }
);

export const UserMongooseModel = model<IUser, UserModel>("User", userSchema);