export interface RefreshTokenPayload {
    userId: string;
    deviceId: string;
    iat: number;
    exp: number;
}
