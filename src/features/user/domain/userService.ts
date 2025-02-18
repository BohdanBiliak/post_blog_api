import {userRepository} from "../userReposytory";
import {hashPassword} from "./passwordService";
import {UserDBModel} from "../../../db/user-db-types";
import {UserViewModel} from "../../../types/user-types";


export const userService = {
    async create(
        login: string,
        email: string,
        password: string
    ): Promise<string | { success: false; errors: { message: string; field: string }[] }> {
        const errors: { message: string; field: string }[] = [];

        if (await userRepository.findByEmail(email)) {
            errors.push({ message: "Email is already taken", field: "email" });
        }

        if (await userRepository.findByLogin(login)) {
            errors.push({ message: "Login is already taken", field: "login" });
        }
        if (errors.length > 0) {
            return { success: false, errors };
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

    async loginUser(loginOrEmail: string, password: string): Promise<boolean> {
        return userRepository.loginUser(loginOrEmail, password);
    },

    map(user: UserDBModel): UserViewModel {
        return {
            id: user.id,
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        };
    }
};
