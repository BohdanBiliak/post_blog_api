import { body } from "express-validator";
import { InputCheckErrorsMiddleware } from "../../../global_middlewares/inputCheckErrorsMiddleware";

export const contentValidator =
    body("content")
        .exists().withMessage("content is required")
        .isString().withMessage("content must be a string")
        .trim()
        .isLength({ min: 20, max: 300 }).withMessage("content length should be between 10 and 500 characters");

export const commentValidator = [
    contentValidator,
    InputCheckErrorsMiddleware
];
