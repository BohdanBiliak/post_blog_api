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
    const auth = req.headers["authorization"];

    console.log("🔍 Checking Authorization Header:", auth);

    if (!auth) {
        console.log("❌ No Authorization Header Found");
        res.status(401).json({ message: "Authorization header is missing" });
        return;
    }

    if (!auth.startsWith("Basic ")) {
        console.log("❌ Invalid Authorization Format");
        res.status(401).json({ message: "Authorization header does not start with 'Basic'" });
        return;
    }

    const base64Credentials = auth.slice(6).trim();
    const decodedCredentials = fromBase64toUTF8(base64Credentials);

    console.log("🔍 Decoded Credentials:", decodedCredentials);

    if (decodedCredentials !== SETTINGS.ADMIN) {
        console.log("❌ Invalid Admin Credentials");
        res.status(401).json({ message: "Invalid credentials" });
        return;
    }

    console.log("✅ Authorization Successful");
    next();
};
