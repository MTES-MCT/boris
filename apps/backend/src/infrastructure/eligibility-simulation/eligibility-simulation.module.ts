import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EligibilitySimulationEntity } from './eligibility-simulation.entity';
import { EligibilitySimulationRepository } from './eligibility-simulation.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EligibilitySimulationEntity])],
  providers: [
    {
      provide: 'EligibilitySimulationRepositoryInterface',
      useClass: EligibilitySimulationRepository,
    },
    EligibilitySimulationRepository,
  ],
  exports: [
    'EligibilitySimulationRepositoryInterface',
    EligibilitySimulationRepository,
  ],
})
export class EligibilitySimulationModule {}
