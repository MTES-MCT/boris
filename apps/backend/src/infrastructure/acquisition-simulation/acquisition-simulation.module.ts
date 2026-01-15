import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcquisitionSimulationEntity } from './acquisition-simulation.entity';
import { CreateAcquisitionSimulationApiController } from './controllers/api/create-acquisition-simulation.controller';
import { AcquisitionSimulationRepository } from './acquisition-simulation.repository';
import { CreateAcquisitionSimulationUsecase } from 'src/application/acquisition-simulation/usecases/create.usecase';
import { UpdateAcquisitionSimulationApiController } from './controllers/api/update-acquisition-simulation.controller';
import { UpdateAcquisitionSimulationUsecase } from 'src/application/acquisition-simulation/usecases/update.usecase';
import { CountAcquisitionSimulationsUsecase } from 'src/application/acquisition-simulation/usecases/count.usecase';
import { CalculateAcquisitionSimulationConversionFunnelUsecase } from 'src/application/acquisition-simulation/usecases/calculateConversionFunnel.usecase';
import { GetAcquisitionSimulationConversionFunnelController } from './controllers/api/get-acquisition-simulation-conversion-funnel.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AcquisitionSimulationEntity])],
  controllers: [
    CreateAcquisitionSimulationApiController,
    UpdateAcquisitionSimulationApiController,
    GetAcquisitionSimulationConversionFunnelController,
  ],
  providers: [
    {
      provide: 'AcquisitionSimulationRepositoryInterface',
      useClass: AcquisitionSimulationRepository,
    },
    AcquisitionSimulationRepository,
    CreateAcquisitionSimulationUsecase,
    UpdateAcquisitionSimulationUsecase,
    CountAcquisitionSimulationsUsecase,
    CalculateAcquisitionSimulationConversionFunnelUsecase,
  ],
  exports: [
    'AcquisitionSimulationRepositoryInterface',
    AcquisitionSimulationRepository,
    CreateAcquisitionSimulationUsecase,
    UpdateAcquisitionSimulationUsecase,
    CountAcquisitionSimulationsUsecase,
    CalculateAcquisitionSimulationConversionFunnelUsecase,
  ],
})
export class AcquisitionSimulationModule {}
