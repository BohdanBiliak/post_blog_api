import "express";

declare module "express-serve-static-core" {
    interface Request {
        user?: {
            id: string;
            login: string;
            email: string;
        };
        deviceId?: string;
    }
}
