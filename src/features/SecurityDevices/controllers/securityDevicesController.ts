import { Request, Response } from "express";
import {deviceSessionService} from "../domain/devicesSessionServices";

export const deviceSessionController = {
    async getSessions(req: Request, res: Response) {
        const userId = req.user!.id;
        const sessions = await deviceSessionService.getUserSessions(userId);
        res.status(200).json(sessions);
    },

    async deleteAllExceptCurrent(req: Request, res: Response) {
        const userId = req.user!.id;
        const currentDeviceId = req.deviceId!;
        await deviceSessionService.terminateOtherSessions(userId, currentDeviceId);
        res.sendStatus(204);
    },

    async deleteDevice(req: Request, res: Response) {
        const userId = req.user!.id;
        const deviceId = req.params.deviceId;

        const session = await deviceSessionService.getUserSessions(userId);
        const targetSession = session.find(s => s.deviceId === deviceId);

        if (!targetSession) return res.sendStatus(404);
        if (targetSession.userId !== userId) return res.sendStatus(403);

        const deleted = await deviceSessionService.terminateSession(deviceId);
        res.sendStatus(deleted ? 204 : 404);
    }
};
