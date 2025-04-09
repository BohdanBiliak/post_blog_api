import { Request, Response } from "express";
import {authService} from "../domain/authSerwise";
import jwt from "jsonwebtoken";
import {RefreshTokenPayload} from "../authTypes/types";
const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || "accessSecretKey";
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || "refreshSecretKey";

const ACCESS_TOKEN_EXP = "10m";
const REFRESH_TOKEN_EXP = "7d";

function createAccessToken(userId: string) {
    return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXP });
}

function createRefreshToken(userId: string, tokenId: string) {
    return jwt.sign({ userId, tokenId }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXP });
}


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
        if (!user) return res.sendStatus(401);
        const tokenId = await authService.createRefreshToken(user.id);
        const refreshToken = createRefreshToken(user.id, tokenId);
        const accessToken = createAccessToken(user.id);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 дней
        });

        res.json({ accessToken });
    },
    async refreshToken(req: Request, res: Response) {
        const token = req.cookies?.refreshToken;
        if (!token) return res.sendStatus(401);

        try {
            const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as RefreshTokenPayload;

            const isValid = await authService.isRefreshTokenValid(payload.tokenId);
            if (!isValid) return res.sendStatus(401);

            const newTokens = await authService.rotateRefreshToken(payload.userId, payload.tokenId);

            res.cookie("refreshToken", newTokens.refreshToken, {httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000  })
                .json({ accessToken: newTokens.accessToken });
        } catch (err) {
            return res.sendStatus(401);
        }
    },
    async logout(req: Request, res: Response) {
        const token = req.cookies?.refreshToken;
        if (!token) return res.sendStatus(401);

        try {
            const payload = jwt.verify(token, REFRESH_TOKEN_SECRET) as RefreshTokenPayload;
            await authService.invalidateRefreshToken(payload.tokenId);
            res.clearCookie("refreshToken").sendStatus(204);
        } catch (err) {
            return res.sendStatus(401);
        }
    },

    async me(req: Request, res: Response) {
        const userId = req.user?.id;
        if (!userId) return res.sendStatus(401);
        const userInfo = await authService.getUserInfo(userId);
        if (!userInfo) return res.sendStatus(404);
        res.json(userInfo);
    },


    async resendConfirmationEmail(req: Request, res: Response) {
        console.log(`Received email for registration: ${req.body.email}`);
        console.log("Received request body:", req.body);
        const { email } = req.body;
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
