import { body } from "express-validator";

export const validationCommentsInput = [
  body("content")
    .exists()
    .withMessage("Content is required")
    .isString()
    .withMessage("Type of content must be string")
    .trim()
    .isLength({
      min: 20,
      max: 300,
    })
    .withMessage("Content length must be 20-300 symbols"),
];