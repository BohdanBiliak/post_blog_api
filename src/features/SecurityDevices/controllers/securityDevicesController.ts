
import { Request, Response } from 'express';
import * as SecurityDeviceRepo from '../securityDeviceRepo';
import {UserDBModel} from "../../../db/user-db-types";
export interface AuthenticatedRequest extends Request {
    user?: UserDBModel;
    id?: string;
}
export const getDevices = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;
    const devices = await SecurityDeviceRepo.findDevicesByUser(userId);
    res.status(200).json(devices);
};

export const deleteAllOtherDevices = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;
    const currentDeviceId = req.id!;
    await SecurityDeviceRepo.deleteOtherDevices(userId, currentDeviceId);
    res.sendStatus(204);
};

export const deleteDeviceById = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;
    const { deviceId } = req.params;
    const result = await SecurityDeviceRepo.deleteDevice(userId, deviceId);

    switch (result) {
        case 'forbidden': return res.sendStatus(403);
        case 'notFound': return res.sendStatus(404);
        default: return res.sendStatus(204);
    }
};
