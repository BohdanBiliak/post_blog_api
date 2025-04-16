
import {SessionDevice} from "./types/types";
import {DeviceSessionModel} from "./models/SecurityDevice";

export const deviceSessionRepository = {
    async create(session: SessionDevice): Promise<void> {
        await DeviceSessionModel.create(session);
    },

    async findByDeviceId(deviceId: string): Promise<SessionDevice | null> {
        return DeviceSessionModel.findOne({ deviceId }).lean();
    },

    async updateLastActiveDate(deviceId: string, newDate: string): Promise<boolean> {
        const result = await DeviceSessionModel.updateOne(
            { deviceId },
            { $set: { lastActiveDate: newDate } }
        );
        return result.modifiedCount === 1;
    },

    async deleteSessionByDeviceId(deviceId: string): Promise<boolean> {
        const result = await DeviceSessionModel.deleteOne({ deviceId });
        return result.deletedCount === 1;
    },

    async deleteAllSessionsExcept(deviceId: string, userId: string): Promise<void> {
        await DeviceSessionModel.deleteMany({
            deviceId: { $ne: deviceId },
            userId: userId
        });
    },

    async findAllSessionsForUser(userId: string): Promise<SessionDevice[]> {
        return DeviceSessionModel.find({ userId }).lean();
    }
};
