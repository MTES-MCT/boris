import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createHash, timingSafeEqual } from 'crypto';
import { AuthRateLimitService } from '../auth-rate-limit.service';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly authRateLimitService: AuthRateLimitService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const apiKey: unknown = request.headers['x-api-key'];
    const expectedApiKey = process.env.API_KEY;

    if (
      typeof apiKey !== 'string' ||
      !expectedApiKey ||
      !this.keysMatch(apiKey, expectedApiKey)
    ) {
      throw new UnauthorizedException();
    }

    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
      const limit = this.positiveIntegerFromEnv('API_WRITE_RATE_LIMIT', 120);
      const windowMs = this.positiveIntegerFromEnv(
        'API_WRITE_RATE_LIMIT_WINDOW_MS',
        60_000,
      );
      const keyFingerprint = createHash('sha256')
        .update(expectedApiKey)
        .digest('hex');

      await this.authRateLimitService.consume(
        `api-write:${keyFingerprint}`,
        limit,
        windowMs,
      );
    }

    return true;
  }

  private keysMatch(provided: string, expected: string): boolean {
    const providedDigest = createHash('sha256').update(provided).digest();
    const expectedDigest = createHash('sha256').update(expected).digest();

    return timingSafeEqual(providedDigest, expectedDigest);
  }

  private positiveIntegerFromEnv(name: string, fallback: number): number {
    const value = Number(process.env[name]);
    return Number.isInteger(value) && value > 0 ? value : fallback;
  }
}
