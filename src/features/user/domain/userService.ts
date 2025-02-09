import {userRepository} from "../userReposytory";
import {hashPassword} from "./passwordService";
import {UserDBModel} from "../../../db/user-db-types";

export const createUser = async (login: string, email: string, password: string) => {
    // Sprawdzenie czy email i login są unikalne
    if (await userRepository.findByEmail(email)) {
        return { success: false, errors: [{ message: "Email is already taken", field: "email" }] };
    }

    if (await userRepository.findByLogin(login)) {
        return { success: false, errors: [{ message: "Login is already taken", field: "login" }] };
    }

    // Haszowanie hasła
    const passwordHash = hashPassword(password);

    // Tworzenie użytkownika
    const newUser: UserDBModel = {
        id: Date.now().toString(),
        login,
        email,
        passwordHash,
        createdAt: new Date().toISOString()
    };

    await userRepository.create(newUser);

    return {
        success: true,
        user: {
            id: newUser.id,
            login: newUser.login,
            email: newUser.email,
            createdAt: newUser.createdAt
        }
    };
};
