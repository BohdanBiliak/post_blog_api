import { UserDBModel } from "../../../models/database/UserDBModel";
import { Paginator } from "../../../models/view/_Paginator";
import { UserViewModel } from "../../../models/view/UserViewModel";
import { UserMongooseModel } from "../../../domain/UserSchema";
import { FilterQuery, SortOrder } from "mongoose";
import { injectable } from "inversify";

@injectable()
export class UsersQueryRepository {
  async findUsers(
    pageNumber: number,
    pageSize: number,
    sortBy: string = "createdAt",
    sortDirection: SortOrder,
    searchLoginTerm?: string,
    searchEmailTerm?: string
  ): Promise<Paginator<UserViewModel[]>> {
    const filter: FilterQuery<UserDBModel> = {};

    if (searchLoginTerm || searchEmailTerm) {
      filter.$or = [];

      if (searchLoginTerm) {
        filter.$or.push({
          "accountData.login": { $regex: searchLoginTerm, $options: "i" },
        });
      }

      if (searchEmailTerm) {
        filter.$or.push({
          "accountData.email": { $regex: searchEmailTerm, $options: "i" },
        });
      }
    }

    const sortingObj: { [key: string]: SortOrder } = {
      [`accountData.${sortBy}`]: "desc",
    };

    if (sortDirection === "asc") {
      sortingObj[`accountData.${sortBy}`] = "asc";
    }

    const output = await UserMongooseModel.find(filter)
      .sort(sortingObj)
      .skip(pageNumber > 0 ? (pageNumber - 1) * pageSize : 0)
      .limit(pageSize > 0 ? pageSize : 0)
      .lean();

    const totalCount = await UserMongooseModel.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount,
      items: await this.usersMapping(output),
    };
  }

  async findUserById(_id: string): Promise<UserViewModel | null> {
    const foundUser = await UserMongooseModel.findOne({ _id });

    if (!foundUser) {
      return null;
    }

    return {
      id: foundUser._id.toString(),
      email: foundUser.accountData.email,
      login: foundUser.accountData.login,
      createdAt: foundUser.accountData.createdAt,
    };
  }

  private async usersMapping(array: UserDBModel[]) {
    return array.map((user) => {
      return {
        id: user._id.toString(),
        login: user.accountData.login,
        email: user.accountData.email,
        createdAt: user.accountData.createdAt,
      };
    });
  }
}