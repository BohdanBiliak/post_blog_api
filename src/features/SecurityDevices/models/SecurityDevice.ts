import mongoose from "mongoose";

const deviceSessionSchema = new mongoose.Schema({
    deviceId: { type: String, required: true },
    ip: { type: String, required: true },
    title: { type: String, required: true },
    lastActiveDate: { type: String, required: true },
    userId: { type: String, required: true }
});

export const DeviceSessionModel = mongoose.model("DeviceSession", deviceSessionSchema);
