import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthRateLimitService } from '../auth/auth-rate-limit.service';
import { ApiKeysService } from './api-keys.service';
import { UserApiKeyEntity } from './user-api-key.entity';

export type LeadsApiRequest = Request & { leadsApiKey: UserApiKeyEntity };

@Injectable()
export class LeadsApiKeyGuard implements CanActivate {
  constructor(
    private readonly keys: ApiKeysService,
    private readonly rateLimit: AuthRateLimitService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<LeadsApiRequest>();
    const match = /^Bearer (boris_live_[a-f0-9]{64})$/i.exec(
      request.headers.authorization || '',
    );
    if (!match) throw new UnauthorizedException();
    const key = await this.keys.authenticate(match[1]);
    await this.rateLimit.consume(`leads-api:${key.id}`, 120, 60_000);
    // Keep API authentication separate from the portal's session principal.
    request.leadsApiKey = key;
    return true;
  }
}
