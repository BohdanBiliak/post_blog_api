import {body} from "express-validator";
import {InputCheckErrorsMiddleware} from "../../../global_middlewares/inputCheckErrorsMiddleware";
import {blogsRepository} from "../../blogs/blogsRepository";
import {NextFunction, Request, Response} from "express";
import {postsRepository} from "../postsRepository";
import {adminMiddleware} from "../../../global_middlewares/admin-middleware";


export const ContentValidatorMiddleware = body("content").isString().withMessage("no string").trim()
    .isLength({min: 1, max:1000}).withMessage('more then 1000 or 0')
export const blogIdValidatorMiddleware = body("blogId")
    .isString().withMessage("no string")
    .trim()
    .custom(blogId => {
        const blog = blogsRepository.find(blogId);
        return !!blog; // Return false if blog does not exist
    }).withMessage("no blog with that id");

export const TitleValidatorMiddleware = body("title")
    .isString().withMessage("no string")
    .isLength({ min: 1, max: 30 }).withMessage("more than 30 or 0");

export const ShortDescriptionValidatorMiddleware = body("shortDescription")
    .isString().withMessage("no string")
    .isLength({ min: 1, max: 100 }).withMessage("more than 100 or 0");
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