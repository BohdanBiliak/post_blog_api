import { body } from "express-validator";

export const validationCodeInput = [
  body("code")
    .exists()
    .withMessage("Confirmation code is required")
    .isString()
    .withMessage("Type of confirmation code must be string"),
];