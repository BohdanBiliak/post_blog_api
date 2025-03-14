import { Request, Response } from "express";
import {authService} from "../domain/authSerwise";
import jwt from "jsonwebtoken";


export const authController = {
    async register(req: Request, res: Response) {
        console.log(`Received email for registration: ${req.body.email}`);
        console.log("Received request body:", req.body);
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
        console.log(`Received email for registration: ${req.body.email}`);
        console.log("Received request body:", req.body);

        const { email } = req.body;

        console.log("Received request body:", req.body);

        console.log(`Received request to resend confirmation email for email: ${email}`);  // Debugging log

        if (!email) {
            return res.status(400).json({
                errorsMessages: [
                    { message: "Email is required", field: "email" }
                ]
            });
        }

        const success = await authService.resendConfirmationEmail(email);

        if (!success) {
            console.log(`Failed to resend confirmation email for ${email}.`);
            return res.status(400).json({
                errorsMessages: [
                    { message: "Invalid email or email already confirmed", field: "email" }
                ]
            });
        }

        console.log(`Successfully resent confirmation email for ${email}.`);
        res.sendStatus(204);
    }


};
