import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartementEntity } from '../departement/departement.entity';
import { DepartementRepository } from '../departement/departement.repository';
import { LandbotCustomerEntity } from './landbot-customer.entity';
import { LandbotCustomerRepository } from './landbot-customer.repository';
import { CreateLandbotCustomerUsecase } from 'src/application/landbot-customer/usecases/create.usecase';
import { LandbotApiClientModule } from '../landbot-api-client/landbot-api-client.module';
import { ImportLandbotCustomersCron } from './cron/import-landbot-customers';

@Module({
  imports: [
    TypeOrmModule.forFeature([DepartementEntity, LandbotCustomerEntity]),
    LandbotApiClientModule,
  ],
  controllers: [],
  providers: [
    {
      provide: 'DepartementRepositoryInterface',
      useClass: DepartementRepository,
    },
    {
      provide: 'LandbotCustomerRepositoryInterface',
      useClass: LandbotCustomerRepository,
    },
    DepartementRepository,
    LandbotCustomerRepository,
    CreateLandbotCustomerUsecase,
    ImportLandbotCustomersCron,
  ],
  exports: [
    'LandbotCustomerRepositoryInterface',
    DepartementRepository,
    LandbotCustomerRepository,
    CreateLandbotCustomerUsecase,
  ],
})
export class LandbotCustomerModule {}
