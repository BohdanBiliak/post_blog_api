import { body } from "express-validator";

export const validationPasswordInput = [
  body("newPassword")
    .exists()
    .withMessage("Password is required")
    .isString()
    .withMessage("Type of password must be string")
    .trim()
    .isLength({
      min: 6,
      max: 20,
    })
    .withMessage("Password length must be 6-20 symbols"),
];