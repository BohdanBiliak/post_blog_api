import { Request, Response } from "express";
import { validateLoginInput} from "../middlewares/userValidator";
import {userService} from "../domain/userService";
import {userRepository} from "../userReposytory";
import jwt from "jsonwebtoken";

export const userController = {
    async create(req: Request, res: Response) {
        try {
            const { login, email, password } = req.body;

            const newUserId = await userService.create(login, email, password);
            if (typeof newUserId !== "string") {
                return res.status(400).json({ errorsMessages: newUserId.errors });
            }

            const newUser = await userService.findAndMap(newUserId);
            res.status(201).json(newUser);
        } catch (error) {
            console.error("🚨 Error creating user:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }

    },

    async login(req: Request, res: Response) {
        try {
            const { loginOrEmail, password } = req.body;
            console.log("📩 Received login request:", { loginOrEmail });

            const errors = validateLoginInput(loginOrEmail, password);
            if (errors) {
                console.error("❌ Validation failed:", errors);
                return res.status(400).json({ errorsMessages: errors });
            }

            // Authenticate the user and get the JWT token
            const accessToken = await userService.loginUser(loginOrEmail, password);
            if (!accessToken) {
                console.error("❌ Authentication failed for:", loginOrEmail);
                return res.status(401).json({ message: "Invalid login or password" });
            }

            console.log("✅ User authenticated:", loginOrEmail);

            // Return the JWT token
            return res.status(200).json({ accessToken });
        } catch (error) {
            console.error("🚨 Unexpected server error during login:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },

    async getAllUsers(req: Request, res: Response) {
        const {
            sortBy = "createdAt",
            sortDirection = "desc",
            pageNumber = "1",
            pageSize = "10",
            searchLoginTerm,
            searchEmailTerm
        } = req.query;

        const users = await userService.getAll(
            parseInt(pageNumber.toString(), 10),
            parseInt(pageSize.toString(), 10),
            sortBy.toString(),
            sortDirection.toString(),
            searchLoginTerm ? searchLoginTerm.toString() : undefined,
            searchEmailTerm ? searchEmailTerm.toString() : undefined
        );

        res.status(200).json(users);
    },
    async deleteUser(req: Request, res: Response) {
        try {
            const deleteFlag = await userService.delete(req.params.id);

            if (!deleteFlag) {
                return res.status(404).send({error: "User not found"});
            }

            res.status(204).send();
        } catch (error) {
            console.error("🚨 Error deleting user:", error);
            res.status(500).json({error: "Failed to delete user."});
        }
    },
    async getCurrentUser(req: Request, res: Response) {
        try {
            // 1. Pobranie tokena z nagłówka "Authorization"
            const authHeader = req.headers["authorization"];
            if (!authHeader || typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            // 2. Wyciąganie tokena
            const token = authHeader.split(" ")[1];
            let decodedToken;
            try {
                // 3. Weryfikacja tokena
                decodedToken = jwt.verify(token, process.env.JWT_SECRET || "yourSecretKey") as { userId: string };
            } catch (error) {
                return res.status(401).json({ message: "Invalid or expired token" });
            }

            // 4. Pobranie użytkownika z bazy danych
            const user = await userRepository.findById(decodedToken.userId);
            if (!user) {
                return res.status(401).json({ message: "User not found" });
            }

            // 5. Zwrócenie danych użytkownika
            return res.status(200).json({
                email: user.email,
                login: user.login,
                userId: user.id,
            });
        } catch (error) {
            console.error("🚨 Error fetching user:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },
}