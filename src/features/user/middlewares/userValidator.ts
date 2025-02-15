import { body } from "express-validator";
import {InputCheckErrorsMiddleware} from "../../../global_middlewares/inputCheckErrorsMiddleware";
import {adminMiddleware} from "../../../global_middlewares/admin-middleware";

export const LoginValidatorMiddleware = body("login")
    .isString().withMessage("Login must be a string")
    .trim()
    .isLength({ min: 3, max: 30 }).withMessage("Login length should be between 3 and 30")
    .custom(login => login.trim() !== "").withMessage("Login cannot be just spaces");

export const EmailValidatorMiddleware = body("email")
    .isString().withMessage("Email must be a string")
    .trim()
    .isEmail().withMessage("Invalid email format");

export const PasswordValidatorMiddleware = body("password")
    .isString().withMessage("Password must be a string")
    .trim()
    .isLength({ min: 6, max: 50 }).withMessage("Password length should be between 6 and 50");

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
    adminMiddleware,
    EmailValidatorMiddleware,
    LoginValidatorMiddleware,
    PasswordValidatorMiddleware,
    InputCheckErrorsMiddleware
];
