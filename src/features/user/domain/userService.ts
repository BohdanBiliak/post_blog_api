import {userRepository} from "../userReposytory";
import {comparePassword, hashPassword} from "./passwordService";
import {UserDBModel} from "../../../db/user-db-types";
import {UserViewModel} from "../../../types/user-types";
import jwt from 'jsonwebtoken';

export const userService = {
    async create(
        login: string,
        email: string,
        password: string
    ): Promise<string | { success: false; errors: { message: string; field: string }[] }> {
        if (await userRepository.findByEmail(email)) {
            return { success: false, errors: [{ message: "Email is already taken", field: "email" }] };
        }

        if (await userRepository.findByLogin(login)) {
            return { success: false, errors: [{ message: "Login is already taken", field: "login" }] };
        }

        const passwordHash = hashPassword(password);

        const newUser: UserDBModel = {
            id: Date.now().toString(),
            login,
            email,
            passwordHash,
            createdAt: new Date().toISOString()
        };

        await userRepository.create(newUser);

        console.log("New user created:", newUser);  // <-- SPRAWDŹ, CZY NOWY UŻYTKOWNIK ZOSTAŁ ZAPISANY

        return newUser.id;
    },

    async find(id: string): Promise<UserViewModel | null> {
        return userRepository.findByLoginOrEmail(id);
    },
    async findAndMap(id: string): Promise<UserViewModel | null> {
        const user = await userRepository.findById(id);
        console.log("findAndMap() result:", user);  // <-- SPRAWDŹ, CZY POBIERA UŻYTKOWNIKA

        if (!user) return null;

        return this.map(user);
    }
    ,

    async getAll(
        pageNumber: number = 1,
        pageSize: number = 10,
        sortBy: string = "createdAt",
        sortDirection: string = "desc",
        searchLoginTerm?: string,
        searchEmailTerm?: string
    ) {
        const validSortDirection: "asc" | "desc" = sortDirection === "asc" ? "asc" : "desc";

        return userRepository.getAllUsers({
            sortBy,
            sortDirection: validSortDirection,
            pageNumber,
            pageSize,
            searchLoginTerm,
            searchEmailTerm
        });
    },

    async delete(id: string): Promise<boolean> {
        return userRepository.delete(id);
    },

    async loginUser(loginOrEmail: string, password: string): Promise<string | null> {
        const user = await userRepository.findByLoginOrEmail(loginOrEmail);
        if (!user || !comparePassword(password, user.passwordHash)) {
            return null;
        }
        return jwt.sign(
            { userId: user.id, login: user.login },
            process.env.JWT_SECRET || "yourSecretKey",
            { expiresIn: "1h" }
        );
    },


    map(user: UserDBModel): UserViewModel {
        return {
            id: user.id,
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        };
    },


};
