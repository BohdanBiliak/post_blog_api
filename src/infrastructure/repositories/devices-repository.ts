import { DeviceMongooseModel } from "../../domain/DeviceSchema";
import { DeviceDBModel } from "../../models/database/DeviceDBModel";
import { DeviceViewModel } from "../../models/view/DeviceViewModel";
import { injectable } from "inversify";

@injectable()
export class DevicesRepository {
  async findDeviceById(deviceId: string): Promise<DeviceDBModel | null> {
    const foundDevice = await DeviceMongooseModel.findOne({ deviceId });

    if (!foundDevice) {
      return null;
    }

    return foundDevice;
  }

  async createDevice(device: DeviceDBModel): Promise<DeviceViewModel> {
    await DeviceMongooseModel.create(device);
    return {
      ip: device.ip,
      title: device.title,
      lastActiveDate: device.lastActiveDate.toString(),
      deviceId: device.deviceId,
    };
  }

  async updateDevice(
    ip: string,
    userId: string,
    issuedAt: number
  ): Promise<boolean> {
    const result = await DeviceMongooseModel.updateOne(
      { userId },
      {
        $set: {
          lastActiveDate: issuedAt,
          ip,
        },
      }
    );
    return result.matchedCount === 1;
  }

  async deleteDevice(deviceId: string): Promise<boolean> {
    const result = await DeviceMongooseModel.deleteOne({ deviceId });
    return result.deletedCount === 1;
  }

  async deleteAllOldDevices(currentDevice: string): Promise<boolean> {
    await DeviceMongooseModel.deleteMany({ deviceId: { $ne: currentDevice } });
    return (await DeviceMongooseModel.countDocuments()) === 1;
  }

  async deleteAll(): Promise<boolean> {
    await DeviceMongooseModel.deleteMany({});
    return (await DeviceMongooseModel.countDocuments()) === 0;
  }
}