import { ObjectId } from "mongodb";

export class RateLimitDBModel {
  constructor(
    public _id: ObjectId,
    public ip: string,
    public endpoint: string,
    public firstAttempt: number,
    public lastAttempt: number,
    public attemptsCount: number
  ) {}
}