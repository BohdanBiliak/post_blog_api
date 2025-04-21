import { body } from "express-validator";

export const validationLikesInput = [
  body("likeStatus")
    .exists()
    .withMessage("Like status is required")
    .isString()
    .withMessage("Type of like status must be string")
    .trim()
    .isIn(["None", "Like", "Dislike"])
    .withMessage(`Like status should be None, Like or Dislike`),
];