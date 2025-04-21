import { NextFunction, Request, Response } from "express";
import { container } from "../composition-root";
import { RateLimitsService } from "../application/rate-limits-service";

const rateLimitsService = container.get(RateLimitsService);

export const rateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ip = req.ip;
  const endpoint = req.originalUrl;

  const foundRateLimit = await rateLimitsService.findRateLimit(ip, endpoint);

  if (!foundRateLimit) {
    await rateLimitsService.createRateLimit(ip, endpoint);
  } else {
    const currentDate = Date.now();
    const firstAttemptDate = foundRateLimit.firstAttempt;
    const lastAttemptDate = foundRateLimit.lastAttempt;
    const diffBetweenNowAndFirst = currentDate - firstAttemptDate;
    const diffBetweenNowAndLast = currentDate - lastAttemptDate;

    if (foundRateLimit.attemptsCount >= 5) {
      // Timeout 5 sec
      if (diffBetweenNowAndLast < 5000) {
        res.sendStatus(429);
        return;
      } else {
        await rateLimitsService.deleteRateLimit(ip, endpoint);
      }
    }

    if (diffBetweenNowAndFirst < 10000) {
      await rateLimitsService.updateCounter(ip, endpoint, currentDate);
    } else {
      await rateLimitsService.deleteRateLimit(ip, endpoint);
      await rateLimitsService.createRateLimit(ip, endpoint);
    }
  }

  next();
};