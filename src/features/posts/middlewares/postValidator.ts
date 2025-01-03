import {body} from "express-validator";
import {InputCheckErrorsMiddleware} from "../../../global_middlewares/inputCheckErrorsMiddleware";
import {blogsRepository} from "../../blogs/blogsRepository";
import {NextFunction, Request, Response} from "express";
import {postsRepository} from "../postsRepository";
import {adminMiddleware} from "../../../global_middlewares/admin-middleware";


export const ContentValidatorMiddleware = body("content")
    .isString().withMessage("content must be a string")
    .trim()
    .isLength({ min: 1, max: 1000 }).withMessage('content length should be between 1 and 1000');


export const blogIdValidatorMiddleware = body("blogId")
    .isString().withMessage("blogId must be a string")
    .trim()
    .custom(blogId => {
        const blog = blogsRepository.find(blogId);
        return !!blog;
    }).withMessage("no blog with that id");


export const TitleValidatorMiddleware = body("title")
    .isString().withMessage("title must be a string")
    .trim()
    .isLength({ min: 1, max: 30 }).withMessage("title length should be between 1 and 30")
    .custom(title => title.trim() !== "").withMessage("title cannot be just spaces");  // Проверка на пустые строки (только пробелы)

export const ShortDescriptionValidatorMiddleware = body("shortDescription")
    .isString().withMessage("shortDescription must be a string")
    .isLength({ min: 1, max: 100 }).withMessage("shortDescription length should be between 1 and 100");

export const findPostValidatorMiddleware = (req: Request<{id:string}>, res: Response, next: NextFunction) => {
    const post = postsRepository.find(req.params.id)
    if (!post) {
        res.status(404).json({})
        return
    }
    next()
}
export const postValidatorMiddleware = [
    adminMiddleware,
    TitleValidatorMiddleware,
    ShortDescriptionValidatorMiddleware,
    ContentValidatorMiddleware,
    blogIdValidatorMiddleware,
    InputCheckErrorsMiddleware
]