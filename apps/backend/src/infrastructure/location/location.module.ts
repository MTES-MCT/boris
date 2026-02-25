import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationEntity } from './location.entity';
import { LocationRepository } from './location.repository';
import { SaveLocationUsecase } from 'src/application/location/usecases/save.usecase';
import { DepartementModule } from '../departement/departement.module';
import { EligibilitySimulationModule } from '../eligibility-simulation/eligibility-simulation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LocationEntity]),
    DepartementModule,
    forwardRef(() => EligibilitySimulationModule),
  ],
  providers: [
    {
      provide: 'LocationRepositoryInterface',
      useClass: LocationRepository,
    },
    LocationRepository,
    SaveLocationUsecase,
  ],
  exports: [
    'LocationRepositoryInterface',
    LocationRepository,
    SaveLocationUsecase,
  ],
})
export class LocationModule {}
