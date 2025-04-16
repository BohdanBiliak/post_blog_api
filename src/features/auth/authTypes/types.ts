export type AccessTokenPayload = {
    userId: string;
};

export type RefreshTokenPayload = {
    deviceId: string;
    userId: string;
    tokenId: string;
    iat: number;
    exp: number;
};
