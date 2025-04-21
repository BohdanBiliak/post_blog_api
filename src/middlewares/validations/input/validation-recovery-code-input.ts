import { body } from "express-validator";

export const validationRecoveryCodeInput = [
  body("recoveryCode")
    .exists()
    .withMessage("Recovery code is required")
    .isString()
    .withMessage("Type of recovery code must be string"),
];