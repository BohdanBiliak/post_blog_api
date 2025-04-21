import { body } from "express-validator";

const loginPattern = /^[a-zA-Z0-9_-]*$/;
const emailPattern = /^[\w\-.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const validationUsersInput = [
  body("login")
    .exists()
    .withMessage("Login is required")
    .isString()
    .withMessage("Type of login must be string")
    .trim()
    .isLength({
      min: 3,
      max: 10,
    })
    .withMessage("Login length must be 3-15 symbols")
    .matches(loginPattern)
    .withMessage("Login must be in correct format"),
  body("password")
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
  body("email")
    .exists()
    .withMessage("E-mail is required")
    .isString()
    .withMessage("Type of e-mail must be string")
    .matches(emailPattern)
    .withMessage("E-mail must be in correct format"),
];