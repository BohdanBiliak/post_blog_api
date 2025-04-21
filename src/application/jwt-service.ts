import jwt from "jsonwebtoken";
import { settings } from "../settings";
import { UserDBModel } from "../models/database/UserDBModel";
import { randomUUID } from "crypto";
import { injectable } from "inversify";

@injectable()
export class JwtService {
  async createAccessTokenJWT(
    user: UserDBModel | null,
    deviceId: string = randomUUID()
  ) {
    const accessToken = jwt.sign(
      { userId: user!._id, deviceId },
      settings.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return { accessToken };
  }
  async createRefreshTokenJWT(
    user: UserDBModel | null,
    deviceId: string = randomUUID()
  ) {
    return jwt.sign({ userId: user!._id, deviceId }, settings.JWT_SECRET, {
      expiresIn: "2h",
    });
  }

  async verifyToken(token: string) {
    try {
      return jwt.verify(token, settings.JWT_SECRET) as {
        userId: number;
        deviceId: string;
        iat: number;
        exp: number;
      };
    } catch (error) {
      return null;
    }
  }
}

// export const jwtService = {};