import { RateLimitDBModel } from "../models/database/RateLimitDBModel";
import { RateLimitsRepository } from "../infrastructure/repositories/rate-limits-repository";
import { ObjectId } from "mongodb";
import { inject, injectable } from "inversify";

@injectable()
export class RateLimitsService {
  constructor(
    @inject(RateLimitsRepository)
    protected rateLimitsRepository: RateLimitsRepository
  ) {}
  async findRateLimit(
    ip: string,
    endpoint: string
  ): Promise<RateLimitDBModel | null> {
    return this.rateLimitsRepository.findRateLimit(ip, endpoint);
  }

  async createRateLimit(
    ip: string,
    endpoint: string
  ): Promise<RateLimitDBModel> {
    const newRateLimit = new RateLimitDBModel(
      new ObjectId(),
      ip,
      endpoint,
      Date.now(),
      Date.now(),
      1
    );

    return this.rateLimitsRepository.createRateLimit(newRateLimit);
  }

  async updateCounter(
    ip: string,
    endpoint: string,
    currentDate: number
  ): Promise<boolean> {
    const rateLimit = await this.rateLimitsRepository.findRateLimit(
      ip,
      endpoint
    );

    if (!rateLimit) {
      return false;
    }

    const attemptsCount = rateLimit.attemptsCount + 1;

    return this.rateLimitsRepository.updateCounter(
      ip,
      endpoint,
      attemptsCount,
      currentDate
    );
  }

  async deleteRateLimit(ip: string, endpoint: string): Promise<boolean> {
    return this.rateLimitsRepository.deleteRateLimit(ip, endpoint);
  }
}