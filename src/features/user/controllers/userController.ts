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
            const user = req.user;  // Доступ к user, который был добавлен middleware

            if (!user) {
                return res.status(401).json({ message: "User not found" });
            }

            return res.status(200).json({
                email: user.email,
                login: user.login,
                userId: user.id,
            });
        } catch (error) {
            console.error("🚨 Error fetching user:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

}