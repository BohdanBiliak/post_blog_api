import { param } from "express-validator";
import { container } from "../../../composition-root";
import { DevicesService } from "../../../application/devices-service";

const devicesService = container.get(DevicesService);

export const validationDevicesFindByParamId = param("deviceId").custom(
    async (value) => {
        const result = await devicesService.findDeviceById(value);
        if (!result) {
            const error: any = new Error("Device not found");
            error.notFound = true;
            throw error;
        }
        return true;
    }
);