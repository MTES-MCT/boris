import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { timingSafeEqual } from 'crypto';
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
      await this.authRateLimitService.consume('api-write', limit, windowMs);
    }

    return true;
  }

  private keysMatch(provided: string, expected: string): boolean {
    const providedBuffer = Buffer.from(provided);
    const expectedBuffer = Buffer.from(expected);
    const normalizedProvidedBuffer = Buffer.alloc(expectedBuffer.length);

    providedBuffer.copy(normalizedProvidedBuffer, 0, 0, expectedBuffer.length);
    const valuesMatch = timingSafeEqual(
      normalizedProvidedBuffer,
      expectedBuffer,
    );

    return valuesMatch && providedBuffer.length === expectedBuffer.length;
  }

  private positiveIntegerFromEnv(name: string, fallback: number): number {
    const value = Number(process.env[name]);
    return Number.isInteger(value) && value > 0 ? value : fallback;
  }
}
