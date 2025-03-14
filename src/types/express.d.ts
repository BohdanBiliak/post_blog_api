
declare namespace Express {
    export interface Request {
        user?: {
            email: any;
            id: string;
            login: string;
        };
    }
}
