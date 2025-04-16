import { Router } from "express";
import {deviceSessionController} from "./controllers/securityDevicesController";
import {authMiddleware} from "./middlewares/authMiddleware";

export const devicesRouter = Router();

devicesRouter.get("/security/devices", authMiddleware, deviceSessionController.getSessions);
devicesRouter.delete("/security/devices", authMiddleware, deviceSessionController.deleteAllExceptCurrent);
devicesRouter.delete("/security/devices/:deviceId", authMiddleware, deviceSessionController.deleteDevice);
