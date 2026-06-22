import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

type Bucket = {
  count: number;
  resetAt: number;
};

@Injectable()
export class EmbedRateLimiterService {
  private readonly buckets = new Map<string, Bucket>();
  private readonly maxRequests = 60;
  private readonly windowMs = 60_000;

  public assertAllowed(key: string) {
    const now = Date.now();
    const bucket = this.buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      this.buckets.set(key, {
        count: 1,
        resetAt: now + this.windowMs,
      });
      return;
    }

    if (bucket.count >= this.maxRequests) {
      throw new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS);
    }

    bucket.count += 1;
  }
}
