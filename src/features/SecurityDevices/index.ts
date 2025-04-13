import express from "express";
import {authenticateJWT} from "../../global_middlewares/authJWT";
import * as controller from './controllers/securityDevicesController';

export const secureRouter = express.Router();

secureRouter.get("/devices", authenticateJWT,   controller.getDevices);
secureRouter.delete("/devices", controller.deleteAllOtherDevices);
secureRouter.delete("/devices/:id",controller.deleteDeviceById);