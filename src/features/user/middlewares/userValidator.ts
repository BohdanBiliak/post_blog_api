import { body } from "express-validator";
import {InputCheckErrorsMiddleware} from "../../../global_middlewares/inputCheckErrorsMiddleware";
import {adminMiddleware} from "../../../global_middlewares/admin-middleware";
import { Request, Response, NextFunction } from "express";

export const validateUserInput = (req: Request, res: Response, next: NextFunction) => {
    const { login, email, password } = req.body;
    const errors: { message: string; field: string }[] = [];

    // ✅ Проверяем login
    if (!login || typeof login !== "string") {
        errors.push({ message: "Login must be a string", field: "login" });
    } else if (login.trim().length < 3 || login.trim().length > 30) {
        errors.push({ message: "Login length should be between 3 and 30", field: "login" });
    }

    // ✅ Проверяем email
    if (!email || typeof email !== "string") {
        errors.push({ message: "Email must be a string", field: "email" });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push({ message: "Invalid email format", field: "email" });
    }

    // ✅ Проверяем password
    if (!password || typeof password !== "string") {
        errors.push({ message: "Password must be a string", field: "password" });
    } else if (password.length < 6 || password.length > 50) {
        errors.push({ message: "Password length should be between 6 and 50", field: "password" });
    }

    // ✅ ОТПРАВЛЯЕМ ОТВЕТ 400, если есть ошибки
    if (errors.length > 0) {
        return res.status(400).json({ errorsMessages: errors });
    }

    next();
};



export const validateLoginInput = (loginOrEmail: string, password: string) => {
    const errors: { message: string; field: string }[] = [];
    if (!loginOrEmail || typeof loginOrEmail !== "string" || loginOrEmail.length < 3) {
        errors.push({ message: "Login or email must be at least 3 characters long", field: "loginOrEmail" });
    }
    if (!password || typeof password !== "string" || password.length < 6) {
        errors.push({ message: "Password must be at least 6 characters long", field: "password" });
    }
    return errors.length > 0 ? errors : null;
};
export const userValidatorMiddleware = [
    validateUserInput
];
