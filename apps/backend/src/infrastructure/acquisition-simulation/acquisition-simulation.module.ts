import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcquisitionSimulationEntity } from './acquisition-simulation.entity';
import { CreateAcquisitionSimulationApiController } from './controllers/api/create-acquisition-simulation.controller';
import { AcquisitionSimulationRepository } from './acquisition-simulation.repository';
import { CreateAcquisitionSimulationUsecase } from 'src/application/acquisition-simulation/usecases/create.usecase';
import { UpdateAcquisitionSimulationApiController } from './controllers/api/update-acquisition-simulation.controller';
import { UpdateAcquisitionSimulationUsecase } from 'src/application/acquisition-simulation/usecases/update.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([AcquisitionSimulationEntity])],
  controllers: [
    CreateAcquisitionSimulationApiController,
    UpdateAcquisitionSimulationApiController,
  ],
  providers: [
    {
      provide: 'AcquisitionSimulationRepositoryInterface',
      useClass: AcquisitionSimulationRepository,
    },
    AcquisitionSimulationRepository,
    CreateAcquisitionSimulationUsecase,
    UpdateAcquisitionSimulationUsecase,
  ],
  exports: [
    'AcquisitionSimulationRepositoryInterface',
    AcquisitionSimulationRepository,
    CreateAcquisitionSimulationUsecase,
    UpdateAcquisitionSimulationUsecase,
  ],
})
export class AcquisitionSimulationModule {}
