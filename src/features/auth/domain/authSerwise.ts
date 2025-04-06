import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import {authRepository} from "../authReposytory";
import {emailManager} from "../email/manager/email-manager";



export const authService = {
    async registerUser(login: string, email: string, password: string) {
        const existingUserByEmail = await authRepository.findUserByEmail(email);
        const existingUserByLogin = await authRepository.findUserByLogin(login);

        if (existingUserByEmail) return { error: "User with this email already exists", field: "email" };
        if (existingUserByLogin) return { error: "User with this login already exists", field: "login" };

        const hashedPassword = await bcrypt.hash(password, 10);
        const confirmationCode = uuidv4();

        const newUser = {
            login,
            email,
            passwordHash: hashedPassword,
            confirmationCode,
            isConfirmed: false,
            id: Date.now().toString(),
            createdAt: new Date().toString()
        };
        await authRepository.createUser(newUser);
        emailManager.sendConfirmationEmail(email, confirmationCode)
            .then(() => {
                console.log(`Confirmation email sent to ${email}`);
            })
            .catch((error) => {
                console.error(`Failed to send confirmation email to ${email}:`, error);
            });

        return { success: true };
    },

    async confirmEmail(code: string): Promise<boolean> {
        const user = await authRepository.findUserByCode(code);  // Zmiana
        if (!user || user.isConfirmed) return false;

        return await authRepository.confirmUser(user.email);
    },
    async validateUser(loginOrEmail: string, password: string) {
        const user = await authRepository.findUserByLoginOrEmail(loginOrEmail);
        if (!user) return null;

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        return isMatch ? user : null;
    },

    async resendConfirmationEmail(email: string): Promise<boolean> {
        const user = await authRepository.findUserByEmail(email);
        if (!user) {
            return false;
        }

        if (user.isConfirmed) {
            return false;
        }

        const confirmationCode = uuidv4();

        const updateSuccess = await authRepository.updateUserConfirmationCode(email, confirmationCode);

        if (!updateSuccess) {
            return false;
        }

        console.log(`Sending confirmation email to ${email} with code ${confirmationCode}`);
        await emailManager.sendConfirmationEmail(email, confirmationCode);

        console.log(`Confirmation email sent successfully to ${email}.`);
        return true;
    }

};
