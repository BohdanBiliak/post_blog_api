import { body } from "express-validator";

const emailPattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const validationEmailInput = [
  body("email")
    .exists()
    .withMessage("E-mail is required")
    .isString()
    .withMessage("Type of e-mail must be string")
    .matches(emailPattern)
    .withMessage("E-mail must be in correct format"),
];