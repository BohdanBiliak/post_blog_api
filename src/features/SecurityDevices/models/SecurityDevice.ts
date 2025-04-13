import { Schema, model, Document } from 'mongoose';

export interface ISecurityDevice extends Document {
    userId: string;
    deviceId: string;
    title: string;
    ip: string;
    lastActiveDate: Date;
    expiresAt: Date;
}

const SecurityDeviceSchema = new Schema<ISecurityDevice>({
    userId: { type: String, required: true },
    deviceId: { type: String, required: true },
    title: { type: String, required: true },
    ip: { type: String, required: true },
    lastActiveDate: { type: Date, required: true },
    expiresAt: { type: Date, required: true }
});

export default model<ISecurityDevice>('SecurityDevice', SecurityDeviceSchema);