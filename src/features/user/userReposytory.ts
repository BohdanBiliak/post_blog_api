import {userCollection} from "../../db/db";
import {UserDBModel} from "../../db/user-db-types";
import {comparePassword} from "./domain/passwordService";
import {UserViewModel} from "../../types/user-types";
interface GetUsersQueryParams {
    sortBy: string;
    sortDirection: "asc" | "desc";
    pageNumber: number;
    pageSize: number;
    searchLoginTerm?: string;
    searchEmailTerm?: string;
}

export const userRepository = {
    async create(user: UserDBModel): Promise<string> {
        const result = await userCollection.insertOne(user);

        console.log("Inserted user:", user);  // <-- Sprawdź, czy dane są poprawne
        console.log("Inserted result ID:", result.insertedId);

        if (!result.insertedId) {
            throw new Error("User creation failed");
        }

        return user.id;
    },

        async findById(id: string): Promise<UserDBModel | null> {
            console.log("🔍 SZUKAM UŻYTKOWNIKA O ID:", id);  // <-- SPRAWDŹ, czy ID się zgadza
            return await userCollection.findOne({ id });  // <-- Szukamy po ID użytkownika, nie po `_id`


    },


    async findByEmail(email: string): Promise<UserDBModel | null> {
        return await userCollection.findOne({ email });
    },

    async findByLogin(login: string): Promise<UserDBModel | null> {
        return await userCollection.findOne({ login });
    },

    async findByLoginOrEmail(loginOrEmail: string): Promise<UserDBModel | null> {
        return await userCollection.findOne({
            $or: [{ login: loginOrEmail }, { email: loginOrEmail }]
        });
    },
    async loginUser(loginOrEmail: string, password: string): Promise<boolean> {
        console.log("🔍 Checking user:", loginOrEmail);
        const user = await userRepository.findByLoginOrEmail(loginOrEmail);
        if (!user || !comparePassword(password, user.passwordHash)) {
            console.error("❌ Invalid login:", loginOrEmail);
            return false; // Zawsze zwraca `true` albo `false`
        }
        return true;
    },




    async getAllUsers({
                          sortBy,
                          sortDirection,
                          pageNumber,
                          pageSize,
                          searchLoginTerm,
                          searchEmailTerm
                      }: GetUsersQueryParams): Promise<{ pagesCount: number; page: number; pageSize: number; totalCount: number; items: UserViewModel[] }> {

        const filter: any = {};

        const orConditions = [];

        // **🔍 Fuzzy Matching for Login (if provided)**
        if (searchLoginTerm) {
            const searchRegex = new RegExp(searchLoginTerm.split("").join(".*"), "i");
            orConditions.push({ login: { $regex: searchRegex } });
        }

        // **🔍 Fuzzy Matching for Email (if provided)**
        if (searchEmailTerm) {
            const searchEmailRegex = new RegExp(searchEmailTerm.split("").join(".*"), "i");
            orConditions.push({ email: { $regex: searchEmailRegex } });
        }

        // Apply `$or` only if there are conditions
        if (orConditions.length > 0) {
            filter.$or = orConditions;
        }

        console.log("🔍 FILTER:", JSON.stringify(filter, null, 2)); // Debug

        const totalCount = await userCollection.countDocuments(filter);
        const pagesCount = Math.ceil(totalCount / pageSize);

        const users = await userCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        console.log("🔍 USERS FOUND:", users.map(u => u.login)); // Debugging users found
        console.log("🔍 EMAILS FOUND:", users.map(u => u.email)); // Debugging emails found

        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: users.map(user => ({
                id: user.id,
                login: user.login,
                email: user.email,
                createdAt: user.createdAt
            }))
        };
    }

    ,

    async delete(id: string): Promise<boolean> {
        const user = await userCollection.findOne({ id });

        if (!user) {
            return false;
        }

        const result = await userCollection.deleteOne({ id });
        return result.deletedCount === 1;
    }
};
