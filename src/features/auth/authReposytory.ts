import {accountCollection, userCollection} from "../../db/db";
import {UserDBModel} from "../../db/user-db-types";
import {UserAccountDBType} from "../user/userTypes/userTypes";

class UserDBType {
}

export const authRepository = {
    async createUser(user: UserDBType): Promise<void> {
        // @ts-ignore
        await userCollection.insertOne(user);
    },

    async findUserByEmail(email: string): Promise<UserDBModel | null> {
        return await userCollection.findOne({ email });
    },

    async confirmUser(email: string): Promise<boolean> {
        const result = await userCollection.updateOne(
            { email },
            { $set: { isConfirmed: true } }
        );
        return result.matchedCount > 0;
    },
    async findUserByCode(code: string): Promise<UserDBModel | null> {
        return await userCollection.findOne({ confirmationCode: code });
    },


    async findUserByLoginOrEmail(loginOrEmail: string) {
        return await userCollection.findOne({
            $or: [{ email: loginOrEmail }, { login: loginOrEmail }]
        });
    }

}