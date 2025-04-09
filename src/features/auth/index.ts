import {userController} from "../user/controllers/userController";
import {Router} from 'express'
import {authController} from "./controllers/authControllers";
import { registrationValidatorMiddleware} from "./email/middlewares/registrationValidation";
import {authenticateJWT} from "../../global_middlewares/authJWT";



export const authRouter = Router()

authRouter.post("/login", authController.login);
authRouter.post("/registration-confirmation", authController.confirmRegistration)
authRouter.post("/registration",registrationValidatorMiddleware, authController.register);
authRouter.post("/registration-email-resending", authController.resendConfirmationEmail)
authRouter.post("/refresh-token", authController.refreshToken);
authRouter.post("/logout", authController.logout);
authRouter.get("/me", authenticateJWT, authController.me);