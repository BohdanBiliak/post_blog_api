import { body } from "express-validator";
import {InputCheckErrorsMiddleware} from "../../../global_middlewares/inputCheckErrorsMiddleware";
import {adminMiddleware} from "../../../global_middlewares/admin-middleware";

import { Request, Response, NextFunction } from "express";

export const userValidatorMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors: { message: string; field: string }[] = [];
    const { login, email, password } = req.body;

    // ✅ Sprawdzenie loginu
    if (!login || typeof login !== "string" || login.trim().length < 3 || login.trim().length > 30) {
        errors.push({ message: "Login length should be between 3 and 30", field: "login" });
    }

    // ✅ Sprawdzenie emaila (prosty regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
        errors.push({ message: "Invalid email format", field: "email" });
    }

    // ✅ Sprawdzenie hasła
    if (!password || typeof password !== "string" || password.length < 6 || password.length > 50) {
        errors.push({ message: "Password length should be between 6 and 50", field: "password" });
    }

    // ❌ Jeśli są błędy, zwróć status 400
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
