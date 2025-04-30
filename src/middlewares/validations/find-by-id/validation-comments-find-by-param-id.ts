import { param } from "express-validator";
import { isValidObjectId } from "mongoose";

export const validationCommentsFindByParamId = param("id").custom((value) => {
    if (!isValidObjectId(value)) {
        throw new Error("Invalid comment id format");
    }
    return true;
});
