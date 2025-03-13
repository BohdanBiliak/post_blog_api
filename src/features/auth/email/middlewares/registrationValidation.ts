import { body } from "express-validator";
import {authRepository} from "../../authReposytory";
import {InputCheckErrorsMiddleware} from "../../../../global_middlewares/inputCheckErrorsMiddleware";

export const LoginValidatorMiddleware = body("login")
    .isString().withMessage("login must be a string")
    .trim()
    .isLength({ min: 3, max: 20 }).withMessage("login length should be between 1 and 20")
    .custom(async (login) => {
        const existingUser = await authRepository.findUserByLogin(login);
        if (existingUser) {
            throw new Error("Login is already taken");
        }
        return true;
    });


export const EmailValidatorMiddleware = body("email")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail()
    .custom(async (email) => {
        const existingUser = await authRepository.findUserByEmail(email);
        if (existingUser) {
            throw new Error("Email is already taken");
        }
        return true;
    });


export const PasswordValidatorMiddleware = body("password")
    .isString().withMessage("password must be a string")
    .trim()
    .isLength({min: 5, max: 20  }).withMessage("password must be at least 8 characters long")
    //.matches(/[0-9]/).withMessage("password must contain at least one number")
    //.matches(/[A-Za-z]/).withMessage("password must contain at least one letter");


export const registrationValidatorMiddleware = [
    LoginValidatorMiddleware,
    EmailValidatorMiddleware,
    PasswordValidatorMiddleware,
    InputCheckErrorsMiddleware
];
