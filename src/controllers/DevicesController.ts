import { Request, Response } from "express";
import { JwtService } from "../application/jwt-service";
import { DevicesQueryRepository } from "../infrastructure/repositories/query-repos/devices-query-repository";
import { DevicesService } from "../application/devices-service";
import { inject, injectable } from "inversify";

@injectable()
export class DevicesController {
  constructor(
    @inject(JwtService) protected jwtService: JwtService,
    @inject(DevicesService) protected devicesService: DevicesService,
    @inject(DevicesQueryRepository)
    protected devicesQueryRepository: DevicesQueryRepository
  ) {}
  async getDevices(req: Request, res: Response) {
    const cookieRefreshToken = req.cookies.refreshToken;
    const cookieRefreshTokenObj = await this.jwtService.verifyToken(
      cookieRefreshToken
    );

    if (cookieRefreshTokenObj) {
      const userId = cookieRefreshTokenObj!.userId.toString();
      const foundDevices = await this.devicesQueryRepository.findDevices(
        userId
      );
      res.json(foundDevices);
    } else {
      res.sendStatus(401);
    }
  }

  async deleteDevice(req: Request, res: Response) {
    const isDeleted = await this.devicesService.deleteDevice(
      req.params.deviceId
    );
    if (isDeleted) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  }

  async deleteDevices(req: Request, res: Response) {
    const cookieRefreshToken = req.cookies.refreshToken;
    const cookieRefreshTokenObj = await this.jwtService.verifyToken(
      cookieRefreshToken
    );
    if (cookieRefreshTokenObj) {
      const currentDevice = cookieRefreshTokenObj.deviceId;
      await this.devicesService.deleteAllOldDevices(currentDevice);
      res.sendStatus(204);
    } else {
      res.sendStatus(401);
    }
  }
}