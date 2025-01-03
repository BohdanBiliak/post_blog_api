import {body} from "express-validator";
import {InputCheckErrorsMiddleware} from '../../../global_middlewares/inputCheckErrorsMiddleware'
import {NextFunction, Response, Request} from "express";
import {blogsRepository} from "../blogsRepository";
import {adminMiddleware} from "../../../global_middlewares/admin-middleware";

export const  nameValidator = body("name").isString().withMessage('not string')
    .trim().isLength({min: 1, max:15}).withMessage("more than 15 or 0")

export const descriptionValidator = body("description").isString().withMessage('not string')
    .trim().isLength({min: 1, max:500}).withMessage('more than 500 characters long or 0')
export const websiteUrlValidator = body("websiteUrl").isString().withMessage('not string')
    .trim().isLength({min:1, max:100}).withMessage('more than 100 characters long or 0')


export const findBlogValidator = (req: Request, res: Response, next: NextFunction) => {
    next();
}

export const blogValidator = [
    adminMiddleware,
    nameValidator,
    descriptionValidator,
    websiteUrlValidator,
    InputCheckErrorsMiddleware
]