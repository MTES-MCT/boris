import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EligibilitySimulationEntity } from './eligibility-simulation.entity';
import { EligibilitySimulationRepository } from './eligibility-simulation.repository';
import { CreateEligibilitySimulationUsecase } from 'src/application/eligibility-simulation/usecases/create.usecase';
import { CreateEligibilitySimulationApiController } from './controllers/api/create-eligibility-simulation.controller';
import { UpdateEligibilitySimulationApiController } from './controllers/api/update-eligibility-simulation.controller';
import { UpdateEligibilitySimulationUsecase } from 'src/application/eligibility-simulation/usecases/update.usecase';
import { LocationModule } from '../location/location.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EligibilitySimulationEntity]),
    forwardRef(() => LocationModule),
  ],
  controllers: [
    CreateEligibilitySimulationApiController,
    UpdateEligibilitySimulationApiController,
  ],
  providers: [
    {
      provide: 'EligibilitySimulationRepositoryInterface',
      useClass: EligibilitySimulationRepository,
    },
    EligibilitySimulationRepository,
    CreateEligibilitySimulationUsecase,
    UpdateEligibilitySimulationUsecase,
  ],
  exports: [
    'EligibilitySimulationRepositoryInterface',
    EligibilitySimulationRepository,
    CreateEligibilitySimulationUsecase,
    UpdateEligibilitySimulationUsecase,
  ],
})
export class EligibilitySimulationModule {}
