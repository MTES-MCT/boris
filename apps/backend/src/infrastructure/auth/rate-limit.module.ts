import { Module } from '@nestjs/common';
import { ApiKeyGuard } from './guards/api-key.guard';
import { AuthRateLimitService } from './auth-rate-limit.service';

@Module({
  providers: [AuthRateLimitService, ApiKeyGuard],
  exports: [AuthRateLimitService, ApiKeyGuard],
})
export class RateLimitModule {}
