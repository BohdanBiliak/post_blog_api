import { NextFunction, Request, Response } from "express";
import { SETTINGS } from "../settings";

export const fromBase64toUTF8 = (code: string): string => {
    const buff = Buffer.from(code, "base64");
    return buff.toString("utf8");
};

export const fromUTF8TOBase64 = (code: string): string => {
    const buff2 = Buffer.from(code, "utf8");
    return buff2.toString("base64");
};

export const adminMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const auth = req.headers["authorization"]; // Извлекаем заголовок

    if (!auth) {
        res.status(401).json({ message: "Authorization header is missing" });
        return;
    }

    if (!auth.startsWith("Basic ")) {
        res.status(401).json({ message: "Authorization header does not start with 'Basic'" });
        return;
    }

    const base64Credentials = auth.slice(6).trim();
    const decodedCredentials = fromBase64toUTF8(base64Credentials);

    if (decodedCredentials !== SETTINGS.ADMIN) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
    }

    next(); // Если все проверки прошли, продолжаем выполнение
};
