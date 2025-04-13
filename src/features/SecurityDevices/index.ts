
import {authenticateJWT} from "../../global_middlewares/authJWT";
import {deleteAllOtherDevices, deleteDeviceById, getDevices} from "./controllers/securityDevicesController";
import {Router} from "express";

export const secureRouter = Router();

secureRouter.get("/devices", authenticateJWT,   getDevices);
secureRouter.delete("/devices", deleteAllOtherDevices);
secureRouter.delete("/devices/:id",deleteDeviceById);