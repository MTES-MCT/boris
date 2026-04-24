import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

type Entry = { count: number; resetAt: number };

@Injectable()
export class AuthRateLimitService {
  private readonly entries = new Map<string, Entry>();

  public assertNotLimited(key: string, limit: number, windowMs: number) {
    this.prune(key, windowMs);
    const entry = this.entries.get(key);

    if (entry && entry.count >= limit) {
      throw new HttpException(
        'Too many requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }

  public hit(key: string, windowMs: number) {
    this.prune(key, windowMs);
    const entry = this.entries.get(key);

    if (!entry) {
      this.entries.set(key, { count: 1, resetAt: Date.now() + windowMs });
      return;
    }

    entry.count += 1;
  }

  public clear(key: string) {
    this.entries.delete(key);
  }

  private prune(key: string, windowMs: number) {
    const entry = this.entries.get(key);

    if (!entry) {
      return;
    }

    if (entry.resetAt <= Date.now()) {
      this.entries.delete(key);
      return;
    }

    if (!entry.resetAt) {
      entry.resetAt = Date.now() + windowMs;
    }
  }
}
