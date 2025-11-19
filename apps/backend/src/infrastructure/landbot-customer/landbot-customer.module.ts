import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartementEntity } from '../departement/departement.entity';
import { DepartementRepository } from '../departement/departement.repository';
import { LandbotCustomerEntity } from './landbot-customer.entity';
import { LandbotCustomerRepository } from './landbot-customer.repository';
import { CreateLandbotCustomerUsecase } from 'src/application/landbot-customer/usecases/create.usecase';
import { LandbotApiClientModule } from '../landbot-api-client/landbot-api-client.module';
import { ImportLandbotCustomersCron } from './cron/import-landbot-customers';
import { FindLastLandbotCustomerUsecase } from 'src/application/landbot-customer/usecases/findLast.usecase';
import { GroupByEligibilityUsecase } from 'src/application/landbot-customer/usecases/groupByEligibility.usecase';
import { GroupByBrsKnowledgeUsecase } from 'src/application/landbot-customer/usecases/groupByBrsKnowledge.usecase';
import { GroupByRealEstateSituationUsecase } from 'src/application/landbot-customer/usecases/groupByRealEstateSituation.usecase';

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
    FindLastLandbotCustomerUsecase,
    GroupByEligibilityUsecase,
    GroupByBrsKnowledgeUsecase,
    GroupByRealEstateSituationUsecase,
    ImportLandbotCustomersCron,
  ],
  exports: [
    'LandbotCustomerRepositoryInterface',
    DepartementRepository,
    LandbotCustomerRepository,
    CreateLandbotCustomerUsecase,
    FindLastLandbotCustomerUsecase,
    GroupByEligibilityUsecase,
    GroupByBrsKnowledgeUsecase,
    GroupByRealEstateSituationUsecase,
  ],
})
export class LandbotCustomerModule {}
