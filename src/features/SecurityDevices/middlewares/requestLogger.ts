import { Request, Response, NextFunction } from 'express';
import RequestLog from '../models/RequestLog';

export const requestLogger = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const log = new RequestLog({
            IP: req.ip,
            URL: req.originalUrl || req.baseUrl,
            date: new Date()
        });
        await log.save();

        const tenSecondsAgo = new Date(Date.now() - 10 * 1000);
        const count = await RequestLog.countDocuments({
            IP: req.ip,
            URL: log.URL,
            date: { $gte: tenSecondsAgo }
        });

        console.log(`Requests from ${req.ip} to ${log.URL} in the last 10 sec: ${count}`);
    } catch (e) {
        console.error('Error in requestLogger:', e);
    }
    next();
};
