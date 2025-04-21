import { body } from "express-validator";

const websiteUrlPattern =
  /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;

export const validationBlogsInput = [
  body("name")
    .exists()
    .withMessage("Name is required")
    .isString()
    .withMessage("Type of name must be string")
    .trim()
    .isLength({
      min: 1,
      max: 15,
    })
    .withMessage(
      "Name length must be more than 0 and less than or equal to 15 symbols"
    ),
  body("description")
    .exists()
    .withMessage("Description is required")
    .isString()
    .withMessage("Type of description must be string")
    .trim()
    .isLength({
      min: 1,
      max: 500,
    })
    .withMessage(
      "Description length must be more than 0 and less than or equal to 500 symbols"
    ),
  body("websiteUrl")
    .exists()
    .withMessage("Website URL is required")
    .isString()
    .withMessage("Type of Website URL must be string")
    .trim()
    .isLength({
      min: 1,
      max: 100,
    })
    .withMessage(
      "Website URL length must be more than 0 and less than or equal to 100 symbols"
    )
    .matches(websiteUrlPattern)
    .withMessage("Website URL must be in correct format"),
];