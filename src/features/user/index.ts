import express from "express";
import {userController} from "./controllers/userController";
import {adminMiddleware} from "../../global_middlewares/admin-middleware";
import {userValidatorMiddleware} from "./middlewares/userValidator";



export const userRouter = express.Router();

userRouter.post("/",adminMiddleware,userValidatorMiddleware,  userController.create);
userRouter.get("/", userController.getAllUsers);
userRouter.delete("/:id",adminMiddleware, userController.deleteUser);