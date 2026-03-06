import { Module } from '@nestjs/common';
import { typeormConfig } from 'src/infrastructure/persistence/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LandbotCustomerModule } from 'src/infrastructure/landbot-customer/landbot-customer.module';
import { EligibilitySimulationModule } from 'src/infrastructure/eligibility-simulation/eligibility-simulation.module';
import { EligibilitySimulationsSeed } from './seed';
import { LocationModule } from 'src/infrastructure/location/location.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    EligibilitySimulationModule,
    LandbotCustomerModule,
    LocationModule,
  ],
  providers: [EligibilitySimulationsSeed],
})
export class EligibilitySimulationsSeedModule {}
