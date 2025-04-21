import { param } from "express-validator";
import { container } from "../../../composition-root";
import { DevicesService } from "../../../application/devices-service";

const devicesService = container.get(DevicesService);

export const validationDevicesFindByParamId = param("deviceId").custom(async (value, { req, location, path }) => {
    const result = await devicesService.findDeviceById(value);
    if (!result) {
        throw {
            msg: "Device not found",
            param: path,
            location,
            value,
            meta: { notFound: true },
        };
    }
    return true;
});