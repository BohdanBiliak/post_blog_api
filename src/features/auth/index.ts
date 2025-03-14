import {userController} from "../user/controllers/userController";
import {Router} from 'express'
import {authController} from "./controllers/authControllers";
import { registrationValidatorMiddleware} from "./email/middlewares/registrationValidation";


export const authRouter = Router()

authRouter.post("/login", authController.login);
authRouter.post("/registration-confirmation", authController.confirmRegistration)
authRouter.post("/registration",registrationValidatorMiddleware, authController.register);
authRouter.post("/registration-email-resending", authController.resendConfirmationEmail)
authRouter.get("/me", userController.getCurrentUser);