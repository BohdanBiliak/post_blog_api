import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { container } from "../../composition-root";
import { JwtService } from "../../application/jwt-service";
import { UsersService } from "../../application/users-service";

const jwtService = container.get(JwtService);
const usersService = container.get(UsersService);

export const authBearer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    res.sendStatus(401);
    return;
  }

  const token = req.headers.authorization.split(" ")[1];
  const tokenObj = await jwtService.verifyToken(token);

  if (tokenObj) {
    const userId = tokenObj.userId;
    req.user = await usersService.findUserById(new ObjectId(userId));
    next();
  } else {
    res.sendStatus(401);
  }
};