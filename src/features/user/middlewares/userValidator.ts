import { Request, Response, NextFunction } from "express";

export const validateNewUser = (req: Request, res: Response, next: NextFunction) => {
    const { login, email, password } = req.body;
    const errors: { message: string; field: string }[] = [];

    if (!login || typeof login !== "string" || login.length < 3) {
        errors.push({ message: "Login must be at least 3 characters long", field: "login" });
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
        errors.push({ message: "Invalid email format", field: "email" });
    }

    if (!password || typeof password !== "string" || password.length < 6) {
        errors.push({ message: "Password must be at least 6 characters long", field: "password" });
    }

    if (errors.length > 0) {
        return res.status(400).json({ errorsMessages: errors });
    }

    next(); // ✅ Move to the next middleware (user creation)
};


export const validateLoginInput = (loginOrEmail: string, password: string) => {
    const errors: { message: string; field: string }[] = [];

    if (!loginOrEmail || typeof loginOrEmail !== "string" || loginOrEmail.length < 3) {
        errors.push({ message: "Login or email must be at least 3 characters long", field: "loginOrEmail" });
    }

    if (!password || typeof password !== "string" || password.length < 6) {
        errors.push({ message: "Password must be at least 6 characters long", field: "password" });
    }

    return errors.length > 0 ? errors : null;
};
