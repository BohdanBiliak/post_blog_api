import { Request, Response } from "express";
import { UsersService } from "../application/users-service";
import { JwtService } from "../application/jwt-service";
import { DevicesService } from "../application/devices-service";
import { AuthService } from "../application/auth-service";
import { inject, injectable } from "inversify";
import { ObjectId } from "mongodb";

@injectable()
export class AuthController {
  constructor(
    @inject(UsersService) protected usersService: UsersService,
    @inject(AuthService) protected authService: AuthService,
    @inject(JwtService) protected jwtService: JwtService,
    @inject(DevicesService) protected devicesService: DevicesService
  ) {}
  async registerUser(req: Request, res: Response) {
    await this.authService.registerUser(
      req.body.login,
      req.body.password,
      req.body.email
    );
    res.sendStatus(204);
  }

  async confirmRegistration(req: Request, res: Response) {
    await this.authService.confirmEmail(req.body.code);
    res.sendStatus(204);
  }

  async reconfirmRegistration(req: Request, res: Response) {
    await this.authService.resendEmail(req.body.email);
    res.sendStatus(204);
  }

  async login(req: Request, res: Response) {
    const check = await this.usersService.checkCredentials(
      req.body.loginOrEmail,
      req.body.password
    );
    if (check) {
      const ip = req.ip;
      const userAgent = req.headers["user-agent"] || "unknown";
      const user = await this.usersService.findUserByLoginOrEmail(
        req.body.loginOrEmail
      );
      const newAccessToken = await this.jwtService.createAccessTokenJWT(user);
      const newRefreshToken = await this.jwtService.createRefreshTokenJWT(user);
      await this.devicesService.createDevice(newRefreshToken, ip, userAgent);
      res
        .cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: true,
        })
        .status(200)
        .json(newAccessToken);
    } else {
      res.sendStatus(401);
    }
  }

  async refreshTokens(req: Request, res: Response) {
    const ip = req.ip;
    const cookieRefreshToken = req.cookies.refreshToken;

    const cookieRefreshTokenObj = await this.jwtService.verifyToken(
      cookieRefreshToken
    );

    const deviceId = cookieRefreshTokenObj!.deviceId;

    const userId = cookieRefreshTokenObj!.userId.toString();
    const user = await this.usersService.findUserById(new ObjectId(userId));

    const newAccessToken = await this.jwtService.createAccessTokenJWT(
      user,
      deviceId
    );
    const newRefreshToken = await this.jwtService.createRefreshTokenJWT(
      user,
      deviceId
    );
    const newRefreshTokenObj = await this.jwtService.verifyToken(
      newRefreshToken
    );
    const newIssuedAt = newRefreshTokenObj!.iat;

    await this.devicesService.updateDevice(ip, userId, newIssuedAt);

    res
      .cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
      })
      .status(200)
      .json(newAccessToken);
  }

  async logout(req: Request, res: Response) {
    const cookieRefreshToken = req.cookies.refreshToken;
    const cookieRefreshTokenObj = await this.jwtService.verifyToken(
      cookieRefreshToken
    );
    if (cookieRefreshTokenObj) {
      const cookieDeviceId = cookieRefreshTokenObj.deviceId;
      await this.devicesService.deleteDevice(cookieDeviceId);
      res.sendStatus(204);
    } else {
      res.sendStatus(401);
    }
  }

  async recoverPassword(req: Request, res: Response) {
    await this.authService.sendPasswordRecoveryCode(req.body.email);
    res.sendStatus(204);
  }

  async changePassword(req: Request, res: Response) {
    await this.authService.changePassword(
      req.body.recoveryCode,
      req.body.newPassword
    );
    res.sendStatus(204);
  }

  async getAccountInfo(req: Request, res: Response) {
    const accountInfo = {
      email: req.user!.accountData.email,
      login: req.user!.accountData.login,
      userId: req.user!._id,
    };
    res.status(200).json(accountInfo);
  }
}