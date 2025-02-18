import { Request, Response } from "express";
import { validateLoginInput} from "../middlewares/userValidator";
import {userService} from "../domain/userService";

export const userController = {
    async create(req: Request, res: Response) {
        try {
            const { login, email, password } = req.body;

            const result = await userService.create(login, email, password);

            if (typeof result !== "string") {
                return res.status(400).json({ errorsMessages: result.errors });
            }

            const newUser = await userService.findAndMap(result);
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

            // Validate input
            const errors = validateLoginInput(loginOrEmail, password);
            if (errors) {
                console.error("❌ Validation failed:", errors);
                return res.status(400).json({ errorsMessages: errors });
            }

            // Attempt authentication
            const isAuthenticated = await userService.loginUser(loginOrEmail, password);

            // ✅ Always return **401** when authentication fails
            if (!isAuthenticated) {
                console.error("❌ Authentication failed for:", loginOrEmail);
                return res.status(401).json({ message: "Invalid login or password" });
            }

            console.log("✅ User authenticated:", loginOrEmail);
            res.status(204).send();
        } catch (error) {
            console.error("🚨 Unexpected server error during login:", error);
            res.status(500).json({ message: "Internal Server Error" });
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
    }
}