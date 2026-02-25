import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EligibilitySimulationEntity } from './eligibility-simulation.entity';
import { EligibilitySimulationRepository } from './eligibility-simulation.repository';
import { CreateEligibilitySimulationUsecase } from 'src/application/eligibility-simulation/usecases/create.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([EligibilitySimulationEntity])],
  providers: [
    {
      provide: 'EligibilitySimulationRepositoryInterface',
      useClass: EligibilitySimulationRepository,
    },
    EligibilitySimulationRepository,
    CreateEligibilitySimulationUsecase,
  ],
  exports: [
    'EligibilitySimulationRepositoryInterface',
    EligibilitySimulationRepository,
    CreateEligibilitySimulationUsecase,
  ],
})
export class EligibilitySimulationModule {}
