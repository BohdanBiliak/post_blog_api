import { ObjectId } from "mongodb";
import { DevicesRepository } from "../infrastructure/repositories/devices-repository";
import { JwtService } from "./jwt-service";
import { DeviceViewModel } from "../models/view/DeviceViewModel";
import { DeviceDBModel } from "../models/database/DeviceDBModel";
import { inject, injectable } from "inversify";

@injectable()
export class DevicesService {
  constructor(
    @inject(JwtService) protected jwtService: JwtService,
    @inject(DevicesRepository) protected devicesRepository: DevicesRepository
  ) {}
  async findDeviceById(deviceId: string): Promise<DeviceDBModel | null> {
    return this.devicesRepository.findDeviceById(deviceId);
  }

  async createDevice(
    newRefreshToken: string,
    ip: string,
    userAgent: string
  ): Promise<DeviceViewModel | null> {
    const newRefreshTokenObj = await this.jwtService.verifyToken(
      newRefreshToken
    );

    if (!newRefreshTokenObj) {
      return null;
    }

    const userId = newRefreshTokenObj.userId;
    const deviceId = newRefreshTokenObj.deviceId;
    const expirationDate = newRefreshTokenObj.exp;
    const issuedAt = newRefreshTokenObj.iat;

    const newDevice = new DeviceDBModel(
      new ObjectId(),
      ip,
      userAgent,
      userId.toString(),
      deviceId,
      issuedAt,
      expirationDate
    );

    return this.devicesRepository.createDevice(newDevice);
  }

  async updateDevice(
    ip: string,
    userId: string,
    issuedAt: number
  ): Promise<boolean> {
    return this.devicesRepository.updateDevice(ip, userId, issuedAt);
  }

  async deleteDevice(deviceId: string): Promise<boolean> {
    return this.devicesRepository.deleteDevice(deviceId);
  }

  async deleteAllOldDevices(currentDevice: string): Promise<boolean> {
    return this.devicesRepository.deleteAllOldDevices(currentDevice);
  }

  async deleteAll(): Promise<boolean> {
    return this.devicesRepository.deleteAll();
  }
  async isDeviceActive(deviceId: string): Promise<boolean> {
    const device = await this.devicesRepository.findDeviceById(deviceId);
    return !!device;
  }
}