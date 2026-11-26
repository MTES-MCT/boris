import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RateLimitModule } from '../auth/rate-limit.module';
import { EligibilitySimulationModule } from '../eligibility-simulation/eligibility-simulation.module';
import { OfsEntity } from '../ofs/ofs.entity';
import { UserApiKeyEntity } from './user-api-key.entity';
import { ApiKeysService } from './api-keys.service';
import { ApiKeysController } from './api-keys.controller';
import { LeadsApiKeyGuard } from './leads-api-key.guard';
import { LeadsController } from './leads.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserApiKeyEntity, OfsEntity]),
    RateLimitModule,
    EligibilitySimulationModule,
  ],
  controllers: [ApiKeysController, LeadsController],
  providers: [ApiKeysService, LeadsApiKeyGuard],
})
export class LeadsApiModule {}
