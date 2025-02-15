import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { FieldNamesType, OutputErrorsType } from "../types/output-errors-type";

export const InputCheckErrorsMiddleware = (req: Request, res: Response<OutputErrorsType>, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        const errorsArray = errors.array() as { path: FieldNamesType; msg: string }[];

        return res.status(400).json({
            errorsMessages: errorsArray.map(x => ({
                message: x.msg,
                field: x.path
            }))
        });
    }
    next();
};
