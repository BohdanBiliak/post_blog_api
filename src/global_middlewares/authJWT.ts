import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { userRepository } from "../features/user/userReposytory";

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || "accessSecretKey";

export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader || typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET) as { userId: string };

        const user = await userRepository.findById(decodedToken.userId);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = { email: user.email, id: user.id, login: user.login };
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
