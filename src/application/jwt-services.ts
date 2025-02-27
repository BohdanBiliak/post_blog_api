import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Replace with a real secret key
const JWT_EXPIRATION_TIME = '1h'; // You can adjust the expiration time

// Type for the JWT Payload
export interface JwtPayload {
    id: string;
    login: string;
}

export const jwtService = {
    generateAccessToken(payload: JwtPayload): string {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION_TIME });
    },

    verifyAccessToken(token: string): JwtPayload | null {
        try {
            return jwt.verify(token, JWT_SECRET) as JwtPayload;
        } catch (err) {
            console.error('Invalid token:', err);
            return null;
        }
    },
};
