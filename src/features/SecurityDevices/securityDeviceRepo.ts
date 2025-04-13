import SecurityDevice, { ISecurityDevice } from './models/SecurityDevice';
export const findDevicesByUser = async (userId: string): Promise<Partial<ISecurityDevice>[]> => {
    return SecurityDevice.find({ userId, expiresAt: { $gt: new Date() } }, '-_id ip title lastActiveDate deviceId');
};

export const deleteOtherDevices = async (userId: string, currentDeviceId: string): Promise<void> => {
    await SecurityDevice.deleteMany({ userId, deviceId: { $ne: currentDeviceId } });
};

export const deleteDevice = async (userId: string, deviceId: string): Promise<'forbidden' | 'notFound' | 'deleted'> => {
    const device = await SecurityDevice.findOne({ deviceId });
    if (!device) return 'notFound';
    if (device.userId.toString() !== userId) return 'forbidden';
    await SecurityDevice.deleteOne({ deviceId });
    return 'deleted';
};