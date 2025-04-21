import { NextFunction, Request, Response } from "express";
import { ValidationError, validationResult } from "express-validator";

export const validationErrorCheck = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // @ts-ignore
  const errorFormatter = ({ msg, param }: ValidationError) => {
    return {
      message: msg,
      field: param,
    };
  };

  const result = validationResult(req).formatWith(errorFormatter);

  const idFinder = result.array().find((e) => e.field === "id");
  const deviceIdFinder = result.array().find((e) => e.field === "deviceId");

  if (idFinder || deviceIdFinder) {
    res.status(404).json({ errorsMessages: result.array() });
    return;
  }

  if (!result.isEmpty()) {
    res
      .status(400)
      .json({ errorsMessages: result.array({ onlyFirstError: true }) });
  } else {
    next();
  }
};