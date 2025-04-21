import { NextFunction, Request, Response } from "express";
import { ValidationError, validationResult } from "express-validator";

export const validationErrorCheck = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
  const errorFormatter = (error: any) => {
    return {
      message: error.msg,
      field: error.path,
      notFound: error.meta?.notFound || false,
    };
  };

  const result = validationResult(req).formatWith(errorFormatter);
  const errors = result.array();

  if ((req as any).notFound) {
    return res.status(404).json({ errorsMessages: errors });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errorsMessages: errors });
  }
  next();
};
