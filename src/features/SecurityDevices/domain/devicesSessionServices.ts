
import {SessionDevice} from "../types/types";
import {deviceSessionRepository} from "../securityDeviceRepo";


export const deviceSessionService = {
    async createSession(session: SessionDevice): Promise<void> {
        await deviceSessionRepository.create(session);
    },

    async updateSessionActivity(deviceId: string, newDate: string): Promise<boolean> {
        return await deviceSessionRepository.updateLastActiveDate(deviceId, newDate);
    },

    async terminateOtherSessions(userId: string, currentDeviceId: string): Promise<void> {
        await deviceSessionRepository.deleteAllSessionsExcept(currentDeviceId, userId);
    },

    async terminateSession(deviceId: string): Promise<boolean> {
        return await deviceSessionRepository.deleteSessionByDeviceId(deviceId);
    },

    async getUserSessions(userId: string): Promise<SessionDevice[]> {
        return await deviceSessionRepository.findAllSessionsForUser(userId);
    }
};
