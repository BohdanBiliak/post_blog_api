import {body} from "express-validator";
import {InputCheckErrorsMiddleware} from '../../../global_middlewares/inputCheckErrorsMiddleware'
import {NextFunction, Response, Request} from "express";
import {blogsRepository} from "../blogsRepository";
import {adminMiddleware} from "../../../global_middlewares/admin-middleware";

export const  nameValidator =
    body("name").isString().withMessage('not string')
    .trim()
        .isLength({min: 1, max:15}).withMessage("more than 15 or 0")

export const descriptionValidator = body("description").isString().withMessage('not string')
    .trim().isLength({min: 1, max:500}).withMessage('more than 500 characters long or 0')


export const websiteUrlValidator =
    body("websiteUrl")
        .isString().withMessage('websiteUrl is not a valid string')
        .isLength({ min: 1, max: 100 }).withMessage('websiteUrl length should be between 1 and 100')
        .isURL().withMessage('websiteUrl is not a valid URL');


export const findBlogValidator = (req: Request, res: Response, next: NextFunction) => {
    const blog = blogsRepository.find(req.params.id); // Ищем блог по ID
    if (!blog) {
        return res.status(404).send({ error: 'Blog not found' }); // Если не найден, возвращаем 404
    }
    next();
};

export const blogValidator = [
    adminMiddleware,
    nameValidator,
    descriptionValidator,
    websiteUrlValidator,
    InputCheckErrorsMiddleware
]