import { Request, Response } from "express";
import {authService} from "../domain/authSerwise";
import jwt from "jsonwebtoken";


export const authController = {
    async register(req: Request, res: Response) {
        const { login, email, password } = req.body;
        const result = await authService.registerUser(login, email, password);

        if (result.error) {
            return res.status(400).json({
                errorsMessages: [
                    { message: result.error, field: result.field }
                ]
            });
        }

        res.sendStatus(204);
    },

    async confirmRegistration(req: Request, res: Response) {
        const { code } = req.body;

        const success = await authService.confirmEmail(code);
        if (!success) {
            return res.status(400).json({
                errorsMessages: [
                    { message: "Invalid confirmation code", field: "code" }
                ]
            });
        }

        res.sendStatus(204);
    },
    async login(req: Request, res: Response) {
        const { loginOrEmail, password } = req.body;
        const user = await authService.validateUser(loginOrEmail, password);

        if (!user) {
            return res.sendStatus(401);
        }

        const accessToken = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "1h" }
        );

        res.json({ accessToken });
    },

    async resendConfirmationEmail(req: Request, res: Response) {
        const { email } = req.body;

        const success = await authService.resendConfirmationEmail(email);
        if (!success) {
            return res.status(400).json({
                errorsMessages: [
                    { message: "Invalid email or email already confirmed", field: "email" }
                ]
            });
        }

        res.sendStatus(204);
    }

};
