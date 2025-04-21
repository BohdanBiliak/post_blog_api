import { RateLimitDBModel } from "../../models/database/RateLimitDBModel";
import { RateLimitMongooseModel } from "../../domain/RateLimitSchema";
import { injectable } from "inversify";

@injectable()
export class RateLimitsRepository {
  async findRateLimit(
    ip: string,
    endpoint: string
  ): Promise<RateLimitDBModel | null> {
    const foundRateLimit = await RateLimitMongooseModel.findOne({
      ip,
      endpoint,
    });

    if (!foundRateLimit) {
      return null;
    }

    return foundRateLimit;
  }

  async createRateLimit(
    rateLimit: RateLimitDBModel
  ): Promise<RateLimitDBModel> {
    await RateLimitMongooseModel.create(rateLimit);
    return rateLimit;
  }

  async updateCounter(
    ip: string,
    endpoint: string,
    attemptsCount: number,
    currentDate: number
  ): Promise<boolean> {
    const result = await RateLimitMongooseModel.updateOne(
      { ip, endpoint },
      {
        $set: {
          attemptsCount,
          lastAttempt: currentDate,
        },
      }
    );
    return result.matchedCount === 1;
  }

  async deleteRateLimit(ip: string, endpoint: string): Promise<boolean> {
    const result = await RateLimitMongooseModel.deleteOne({ ip, endpoint });
    return result.deletedCount === 1;
  }

  async deleteAll(): Promise<boolean> {
    await RateLimitMongooseModel.deleteMany({});
    return (await RateLimitMongooseModel.countDocuments()) === 0;
  }
}