import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const validationErrorCheck = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
  const errorFormatter = (error: any) => {
    return {
      message: error.msg,
      field: error.path,
    };
  };

  const result = validationResult(req).formatWith(errorFormatter);
  const errors = result.array();

  // Якщо помилка "ID not found" — повертаємо 404
  if (errors.some(e => e.message === "ID not found")) {
    return res.status(404).json({ errorsMessages: errors });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errorsMessages: errors });
  }

  next();
};
