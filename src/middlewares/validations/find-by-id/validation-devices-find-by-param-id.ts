import { param } from "express-validator";
import { container } from "../../../composition-root";
import { DevicesService } from "../../../application/devices-service";

const devicesService = container.get(DevicesService);

export const validationDevicesFindByParamId = param("deviceId").custom(async (value, { req }) => {
    const device = await devicesService.findDeviceById(value);
    if (!device) {
        req.notFound = true;
        throw new Error("Device not found");
    }
    return true;
});