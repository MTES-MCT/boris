import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EligibilitySimulationEntity } from './eligibility-simulation.entity';
import { EligibilitySimulationRepository } from './eligibility-simulation.repository';
import { CreateEligibilitySimulationUsecase } from 'src/application/eligibility-simulation/usecases/create.usecase';
import { CreateEligibilitySimulationApiController } from './controllers/api/create-eligibility-simulation.controller';
import { UpdateEligibilitySimulationApiController } from './controllers/api/update-eligibility-simulation.controller';
import { UpdateEligibilitySimulationUsecase } from 'src/application/eligibility-simulation/usecases/update.usecase';
import { LocationModule } from '../location/location.module';
import { MailerModule } from '../mailer/mailer.module';
import { GoogleSheetsModule } from '../google-sheets/google-sheets.module';
import { GetEligibilitySimulationsGroupedByEligibilityApiController } from './controllers/api/get-eligibility-simulations-grouped-by-eligibility.controller';
import { GroupByEligibilityStatsUsecase } from 'src/application/eligibility-simulation/usecases/group-by-eligibility-stats.usecase';
import { GetEligibilitySimulationsConversionFunnelApiController } from './controllers/api/get-eligibility-simulations-conversion-funnel.controller';
import { CalculateEligibilitySimulationConversionFunnelUsecase } from 'src/application/eligibility-simulation/usecases/calculate-conversion-funnel.usecase';
import { GroupByEligibilitySimulationBrsKnowledgeUsecase } from 'src/application/eligibility-simulation/usecases/group-by-brs-knowledge.usecase';
import { GroupByEligibilitySimulationRealEstateSituationUsecase } from 'src/application/eligibility-simulation/usecases/group-by-real-estate-situation.usecase';
import { GetEligibilitySimulationsMonthlySummaryApiController } from './controllers/api/get-eligibility-simulations-monthly-summary.controller';
import { GroupEligibilitySimulationsByYearAndMonthUsecase } from 'src/application/eligibility-simulation/usecases/group-simulations-by-year-and-month.usecase';
import { GetEligibilitySimulationsGroupedByRegionsApiController } from './controllers/api/get-eligibility-simulations-grouped-by-regions.controller';
import { GroupEligibilitySimulationsByRegionsUsecase } from 'src/application/eligibility-simulation/usecases/group-by-regions.usecase';
import { GetEligibilitySimulationsGroupedByDepartementsApiController } from './controllers/api/get-eligibility-simulations-grouped-by-departements.controller';
import { GroupEligibilitySimulationsByDepartementsUsecase } from 'src/application/eligibility-simulation/usecases/group-by-departements.usecase';
import { CountEligibilitySimulationsUsecase } from 'src/application/eligibility-simulation/usecases/count-simulations.usecase';
import { GetEligibilitySimulationsBrsKnowledgeApiController } from './controllers/api/get-eligibility-simulations-brs-knowledge.controller';
import { GetEligibilitySimulationsRealEstateSituationApiController } from './controllers/api/get-eligibility-simulations-real-estate-situation.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([EligibilitySimulationEntity]),
    forwardRef(() => LocationModule),
    MailerModule,
    GoogleSheetsModule,
  ],
  controllers: [
    CreateEligibilitySimulationApiController,
    UpdateEligibilitySimulationApiController,
    GetEligibilitySimulationsGroupedByEligibilityApiController,
    GetEligibilitySimulationsBrsKnowledgeApiController,
    GetEligibilitySimulationsRealEstateSituationApiController,
    GetEligibilitySimulationsMonthlySummaryApiController,
    GetEligibilitySimulationsGroupedByRegionsApiController,
    GetEligibilitySimulationsGroupedByDepartementsApiController,
    GetEligibilitySimulationsConversionFunnelApiController,
  ],
  providers: [
    {
      provide: 'EligibilitySimulationRepositoryInterface',
      useClass: EligibilitySimulationRepository,
    },
    EligibilitySimulationRepository,
    CreateEligibilitySimulationUsecase,
    UpdateEligibilitySimulationUsecase,
    GroupByEligibilityStatsUsecase,
    GroupByEligibilitySimulationBrsKnowledgeUsecase,
    GroupByEligibilitySimulationRealEstateSituationUsecase,
    GroupEligibilitySimulationsByYearAndMonthUsecase,
    GroupEligibilitySimulationsByRegionsUsecase,
    GroupEligibilitySimulationsByDepartementsUsecase,
    CountEligibilitySimulationsUsecase,
    CalculateEligibilitySimulationConversionFunnelUsecase,
  ],
  exports: [
    'EligibilitySimulationRepositoryInterface',
    EligibilitySimulationRepository,
    CreateEligibilitySimulationUsecase,
    UpdateEligibilitySimulationUsecase,
    GroupByEligibilityStatsUsecase,
    GroupByEligibilitySimulationBrsKnowledgeUsecase,
    GroupByEligibilitySimulationRealEstateSituationUsecase,
    GroupEligibilitySimulationsByYearAndMonthUsecase,
    GroupEligibilitySimulationsByRegionsUsecase,
    GroupEligibilitySimulationsByDepartementsUsecase,
    CountEligibilitySimulationsUsecase,
    CalculateEligibilitySimulationConversionFunnelUsecase,
  ],
})
export class EligibilitySimulationModule {}
