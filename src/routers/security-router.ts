import { Router } from "express";
import { validationErrorCheck } from "../middlewares/validations/_validation-error-check";
import { validationDevicesFindByParamId } from "../middlewares/validations/find-by-id/validation-devices-find-by-param-id";
import { validationDeviceOwner } from "../middlewares/validations/validation-device-owner";
import { container } from "../composition-root";
import { DevicesController } from "../controllers/DevicesController";

export const securityRouter = Router({});

const devicesController = container.get(DevicesController);

securityRouter.get(
  "/devices",
  devicesController.getDevices.bind(devicesController)
);

securityRouter.delete(
  "/devices/:deviceId",
  validationDevicesFindByParamId,
  validationErrorCheck,
  validationDeviceOwner,
  devicesController.deleteDevice.bind(devicesController)
);

securityRouter.delete(
  "/devices",
  devicesController.deleteDevices.bind(devicesController)
);