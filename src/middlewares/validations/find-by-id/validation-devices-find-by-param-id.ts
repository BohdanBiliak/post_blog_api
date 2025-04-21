import { param } from "express-validator";
import { container } from "../../../composition-root";
import { DevicesService } from "../../../application/devices-service";

const devicesService = container.get(DevicesService);

export const validationDevicesFindByParamId = param("deviceId").custom(
  async (value) => {
    const result = await devicesService.findDeviceById(value);
    if (!result) {
      throw new Error("ID not found");
    }
    return true;
  }
);