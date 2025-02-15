import { body } from "express-validator";
import {InputCheckErrorsMiddleware} from "../../../global_middlewares/inputCheckErrorsMiddleware";
import {adminMiddleware} from "../../../global_middlewares/admin-middleware";

export const LoginValidatorMiddleware = body("login")
    .custom((value, { req }) => {
        const errors: { message: string; field: string }[] = [];
        if (!value) {
            errors.push({ message: "Login is required", field: "login" });
        }
        if (typeof value !== "string") {
            errors.push({ message: "Login must be a string", field: "login" });
        }
        if (value.trim().length < 3 || value.trim().length > 30) {
            errors.push({ message: "Login length should be between 3 and 30", field: "login" });
        }
        if (errors.length > 0) {
            throw errors;
        }
        return true;
    });

export const EmailValidatorMiddleware = body("email")
    .custom((value, { req }) => {
        const errors: { message: string; field: string }[] = [];
        if (!value) {
            errors.push({ message: "Email is required", field: "email" });
        }
        if (typeof value !== "string") {
            errors.push({ message: "Email must be a string", field: "email" });
        }
        if (!/^\S+@\S+\.\S+$/.test(value)) {
            errors.push({ message: "Invalid email format", field: "email" });
        }
        if (errors.length > 0) {
            throw errors;
        }
        return true;
    });

export const PasswordValidatorMiddleware = body("password")
    .custom((value, { req }) => {
        const errors: { message: string; field: string }[] = [];
        if (!value) {
            errors.push({ message: "Password is required", field: "password" });
        }
        if (typeof value !== "string") {
            errors.push({ message: "Password must be a string", field: "password" });
        }
        if (value.trim().length < 6 || value.trim().length > 50) {
            errors.push({ message: "Password length should be between 6 and 50", field: "password" });
        }
        if (errors.length > 0) {
            throw errors;
        }
        return true;
    });


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
    LoginValidatorMiddleware,
    EmailValidatorMiddleware,
    PasswordValidatorMiddleware,
    InputCheckErrorsMiddleware
];
