import express from "express";
import {userController} from "./controllers/userController";


export const userRouter = express.Router();

userRouter.post("/", userController.create);
userRouter.post("/login", userController.login);
userRouter.get("/", userController.getAllUsers);
userRouter.delete("/:id", userController.deleteUser);