import {accountCollection, userCollection} from "../../db/db";
import {UserDBModel} from "../../db/user-db-types";


export const authRepository = {
    async createUser(user: UserDBModel): Promise<void> {
        console.log(`Saving user with email: ${user.email}`);
        await userCollection.insertOne(user);
    },

    async findUserByEmail(email: string): Promise<UserDBModel | null> {
        console.log(`Searching for user with email: ${email}`);  // Debugging log
        const user = await userCollection.findOne({ email });
        console.log(`User found: ${user ? JSON.stringify(user) : 'No user found'}`);  // Debugging log
        return user;
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
    },

    async findUserByLogin(login: string): Promise<UserDBModel | null> {
        return await userCollection.findOne({ login });
    },
    async updateUserConfirmationCode(email: string, newCode: string): Promise<boolean> {
        const result = await userCollection.updateOne(
            { email },
            { $set: { confirmationCode: newCode } }
        );

        return result.matchedCount > 0;
    }


}