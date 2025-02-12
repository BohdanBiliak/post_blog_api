import {userCollection} from "../../db/db";
import {UserDBModel} from "../../db/user-db-types";
import {comparePassword} from "./domain/passwordService";
import {UserViewModel} from "../../types/user-types";
import { ObjectId } from "mongodb";
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
        const user = await userRepository.findByLoginOrEmail(loginOrEmail);
        if (!user) {
            return false;
        }
        return comparePassword(password, user.passwordHash);
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

        if (searchLoginTerm) {
            filter.login = { $regex: searchLoginTerm, $options: "i" };
        }
        if (searchEmailTerm) {
            filter.email = { $regex: searchEmailTerm, $options: "i" };
        }

        const totalCount = await userCollection.countDocuments(filter);
        const pagesCount = Math.ceil(totalCount / pageSize);  // ✅ Dodajemy obliczanie liczby stron

        const users = await userCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        return {
            pagesCount,  // ✅ Dodajemy licznik stron
            page: pageNumber,  // ✅ Aktualna strona
            pageSize,  // ✅ Rozmiar strony
            totalCount,  // Całkowita liczba użytkowników
            items: users.map(user => ({
                id: user.id,
                login: user.login,
                email: user.email,
                createdAt: user.createdAt
            }))
        };
    },


    async delete(id: string): Promise<boolean> {
        const user = await userCollection.findOne({ id });

        if (!user) {
            return false;
        }

        const result = await userCollection.deleteOne({ id });
        return result.deletedCount === 1;
    }
};
