import { Request, Response, NextFunction } from "express";
import jwt, {JwtPayload} from "jsonwebtoken";


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies['refreshToken'] || req.headers.authorization?.split(" ")[1];
    if (!token) return res.sendStatus(401);

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

        req.user = {
            id: payload.userId,
            login: payload.login,
            email: payload.email
        };
        req.deviceId = payload.deviceId;

        next();
    } catch {
        res.sendStatus(401);
    }
};
