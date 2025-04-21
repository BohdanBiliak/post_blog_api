import { body } from "express-validator";

export const validationAuthInput = [
  body("loginOrEmail")
    .exists()
    .withMessage("Login or email is required")
    .isString()
    .withMessage("Type of login or email must be string"),
  body("password")
    .exists()
    .withMessage("Password is required")
    .isString()
    .withMessage("Type of password must be string"),
];