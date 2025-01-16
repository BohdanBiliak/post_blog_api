import {body} from "express-validator";
import {InputCheckErrorsMiddleware} from '../../../global_middlewares/inputCheckErrorsMiddleware'
import {NextFunction, Response, Request} from "express";
import {blogsRepository} from "../blogsRepository";
import {adminMiddleware} from "../../../global_middlewares/admin-middleware";
export const blogIdValidatorMiddleware = body("blogId")
    .isString().withMessage("blogId must be a string")
    .trim()
    .custom(async (blogId) => {
        const blog = await blogsRepository.find(blogId);
        if (!blog) {
            throw new Error("no blog with that id");
        }
        return true;
    });

export const nameValidator =
    body("name")
        .exists().withMessage('name is required')
        .isString().withMessage('name must be a string')
        .trim()
        .isLength({ min: 1, max: 15 }).withMessage('name length should be between 1 and 15');

export const descriptionValidator =
    body("description")
        .exists().withMessage('description is required')
        .isString().withMessage('description must be a string')
        .trim()
        .isLength({ min: 1, max: 500 }).withMessage('description length should be between 1 and 500');

export const websiteUrlValidator =
    body("websiteUrl")
        .exists().withMessage('websiteUrl is required')
        .isString().withMessage('websiteUrl must be a string')
        .trim()
        .isLength({ min: 1, max: 100 }).withMessage('websiteUrl length should be between 1 and 100')
        .isURL().withMessage('websiteUrl is not a valid URL');

export const findBlogValidator = (req: Request, res: Response, next: NextFunction) => {
    const blog = blogsRepository.find(req.params.id);
    if (!blog) {
        return res.status(404).send({ error: 'Blog not found' });
    }
    next();
};

export const blogValidator = [
    adminMiddleware,
    nameValidator,
    descriptionValidator,
    websiteUrlValidator,
    blogIdValidatorMiddleware,
    InputCheckErrorsMiddleware
]