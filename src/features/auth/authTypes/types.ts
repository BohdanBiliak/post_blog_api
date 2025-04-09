export type AccessTokenPayload = {
    userId: string;
};

export type RefreshTokenPayload = {
    userId: string;
    tokenId: string;
    iat: number;
    exp: number;
};
