import { UserDBModel } from "../models/database/UserDBModel";

declare global {
  declare namespace Express {
    export interface Request {
      user: UserDBModel | null;
    }
  }
}