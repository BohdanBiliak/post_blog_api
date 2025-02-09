import { Request, Response } from "express";
import {validateNewUser} from "../middlewares/userValidator";
import {createUser} from "../domain/userService";

export const userController = {
    async create(req: Request, res: Response) {
        const { login, email, password } = req.body;
        const errors = validateNewUser(login, email, password);
        if (errors) {
            return res.status(400).json({ errorsMessages: errors });
        }
        const result = await createUser(login, email, password);
        if (!result.success) {
            return res.status(400).json({ errorsMessages: result.errors });
        }

        res.status(201).json(result.user);
    }
};