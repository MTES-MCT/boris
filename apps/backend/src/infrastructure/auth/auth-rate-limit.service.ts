import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthRateLimitService {
  constructor(private readonly dataSource: DataSource) {}

  public async consume(key: string, limit: number, windowMs: number) {
    const resetAt = new Date(Date.now() + windowMs);
    const keyFingerprint = this.fingerprint(key);
    const rows: { count: number }[] = await this.dataSource.query(
      `WITH expired AS (
         DELETE FROM "rate_limit" WHERE "resetAt" <= NOW()
       )
       INSERT INTO "rate_limit" AS rate_limit ("key", "count", "resetAt")
       VALUES ($1, 1, $2)
       ON CONFLICT ("key") DO UPDATE SET
         "count" = CASE
           WHEN rate_limit."resetAt" <= NOW() THEN 1
           ELSE rate_limit."count" + 1
         END,
         "resetAt" = CASE
           WHEN rate_limit."resetAt" <= NOW() THEN EXCLUDED."resetAt"
           ELSE rate_limit."resetAt"
         END
       RETURNING "count"`,
      [keyFingerprint, resetAt],
    );

    if (Number(rows[0]?.count) > limit) {
      throw new HttpException(
        'Too many requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }

  public async clear(key: string) {
    await this.dataSource.query(`DELETE FROM "rate_limit" WHERE "key" = $1`, [
      this.fingerprint(key),
    ]);
  }

  private fingerprint(key: string): string {
    return createHash('sha256').update(key).digest('hex');
  }
}
