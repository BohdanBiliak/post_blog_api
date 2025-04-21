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
      field: error.param,
      notFound: error.meta?.notFound || false,
    };
  };

  const result = validationResult(req).formatWith(errorFormatter);
  const errors = result.array();

  // ❗ Якщо хоча б одна помилка з позначкою notFound — повертаємо 404
  if (errors.some((e) => e.notFound)) {
    return res.status(404).json({ errorsMessages: errors });
  }

  // ❗ Якщо є інші помилки — 400
  if (errors.length > 0) {
    return res.status(400).json({ errorsMessages: errors });
  }

  // ✅ Якщо помилок немає
  next();
};
