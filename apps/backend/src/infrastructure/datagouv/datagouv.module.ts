import { Module } from '@nestjs/common';
import { DatagouvRepository } from './datagouv.repository';
import { UploadMonthlyStatisticsCron } from './cron/upload-monthly-statistics';
import { CsvFileService } from '../csv-file/csv-file.service';
import { EligibilitySimulationModule } from '../eligibility-simulation/eligibility-simulation.module';

@Module({
  imports: [EligibilitySimulationModule],
  providers: [
    {
      provide: 'DatagouvRepositoryInterface',
      useClass: DatagouvRepository,
    },
    {
      provide: 'CsvFileServiceInterface',
      useClass: CsvFileService,
    },
    UploadMonthlyStatisticsCron,
  ],
  exports: ['DatagouvRepositoryInterface', UploadMonthlyStatisticsCron],
})
export class DatagouvModule {}
