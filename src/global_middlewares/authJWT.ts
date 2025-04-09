import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {userRepository} from "../features/user/userReposytory";


export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader || typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "yourSecretKey") as { userId: string };

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
