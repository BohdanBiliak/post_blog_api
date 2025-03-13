
export type UserDBModel = {
    confirmationCode: string;
    isConfirmed: boolean;
    id: string,
    login: string,
    email: string,
    passwordHash: string,
    createdAt: string,
}