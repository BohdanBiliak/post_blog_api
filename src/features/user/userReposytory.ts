

import {UserViewModel} from "../../types/user-types";
import {userCollection} from "../../db/db";
import {UserDBModel} from "../../db/user-db-types";

export const userRepository = {
    async create(user: UserDBModel): Promise<string> {
        await userCollection.insertOne(user);
        return user.id;
    },

    async findByEmail(email: string): Promise<UserDBModel | null> {
        return await userCollection.findOne({ email });
    },

    async findByLogin(login: string): Promise<UserDBModel | null> {
        return await userCollection.findOne({ login });
    }
};
