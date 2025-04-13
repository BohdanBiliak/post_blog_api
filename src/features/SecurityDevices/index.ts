import express from "express";
import {authenticateJWT} from "../../global_middlewares/authJWT";
import {deleteAllOtherDevices, deleteDeviceById, getDevices} from "./controllers/securityDevicesController";

export const secureRouter = express.Router();

secureRouter.get("/devices", authenticateJWT,   getDevices);
secureRouter.delete("/devices", deleteAllOtherDevices);
secureRouter.delete("/devices/:id",deleteDeviceById);