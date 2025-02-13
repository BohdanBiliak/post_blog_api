import express from "express";
import {userController} from "./controllers/userController";
import {adminMiddleware} from "../../global_middlewares/admin-middleware";
import {validateNewUser} from "./middlewares/userValidator";


export const userRouter = express.Router();

userRouter.post("/", adminMiddleware, userController.create);
userRouter.post("/login", userController.login);
userRouter.get("/", userController.getAllUsers);
userRouter.delete("/:id",adminMiddleware, userController.deleteUser);