import { LeadNotificationQueueModule } from '../ofs/notifications/lead-notification-queue.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationEntity } from './location.entity';
import { LocationRepository } from './location.repository';
import { SaveLocationUsecase } from 'src/application/location/usecases/save.usecase';
import { DepartementModule } from '../departement/departement.module';
import { EligibilitySimulationModule } from '../eligibility-simulation/eligibility-simulation.module';
import { DeleteLocationUsecase } from 'src/application/location/usecases/delete.usecase';

@Module({
  imports: [
    LeadNotificationQueueModule,
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
    DeleteLocationUsecase,
  ],
  exports: [
    'LocationRepositoryInterface',
    LocationRepository,
    SaveLocationUsecase,
    DeleteLocationUsecase,
  ],
})
export class LocationModule {}
