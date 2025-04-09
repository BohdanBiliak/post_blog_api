import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { userRepository } from "../features/user/userReposytory";

export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers["authorization"];
        console.log("Authorization Header:", authHeader);

        if (!authHeader || typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
            console.log("Authorization header is missing or incorrect format");
            return res.status(401).json({ message: "Unauthorized" });
        }

        const token = authHeader.split(" ")[1];
        console.log("Extracted Token:", token);

        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET || "yourSecretKey") as { userId: string };
            console.log("Decoded Token:", decodedToken);
        } catch (error) {
            console.error("Error verifying token:", error);
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        const user = await userRepository.findById(decodedToken.userId);
        console.log("User from DB:", user);

        if (!user) {
            console.log("User not found in the database");
            return res.status(401).json({ message: "User not found" });
        }

        req.user = {
            email:user.email,
            id: user.id,
            login: user.login,
        };

        next();
    } catch (error) {
        console.error("🚨 Error in JWT authentication:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
