import { Router } from "express";
import {deviceSessionController} from "./controllers/securityDevicesController";
import {authMiddleware} from "./middlewares/authMiddleware";

export const devicesRouter = Router();

devicesRouter.get("/devices", authMiddleware, deviceSessionController.getSessions);
devicesRouter.delete("/devices", authMiddleware, deviceSessionController.deleteAllExceptCurrent);
devicesRouter.delete("/devices/:deviceId", authMiddleware, deviceSessionController.deleteDevice);
