import { Request, Response } from "express";
import { validateLoginInput, validateNewUser } from "../middlewares/userValidator";
import {userService} from "../domain/userService";

export const userController = {
    async create(req: Request, res: Response) {
        const {login, email, password} = req.body;
        const errors = validateNewUser(login, email, password);

        if (errors) {
            return res.status(400).json({errorsMessages: errors});
        }

        const result = await userService.create(login, email, password);

        if (typeof result !== "string") {
            return res.status(400).json({errorsMessages: result.errors});
        }

        // Pobranie użytkownika po ID (upewniamy się, że zwraca poprawne dane)
        const newUser = await userService.findAndMap(result);

        if (!newUser) {
            console.error("ERROR: Created user could not be found in DB!", result);
            return res.status(500).json({message: "Internal Server Error: User was created but not found"});
        }

        res.status(201).json(newUser);
    }
    ,

    async login(req: Request, res: Response) {
        const {loginOrEmail, password} = req.body;
        const errors = validateLoginInput(loginOrEmail, password);
        if (errors) {
            return res.status(400).json({errorsMessages: errors});
        }

        const isAuthenticated = await userService.loginUser(loginOrEmail, password);
        if (!isAuthenticated) {
            return res.status(401).json({message: "Invalid login or password"});
        }

        res.status(204).send();
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