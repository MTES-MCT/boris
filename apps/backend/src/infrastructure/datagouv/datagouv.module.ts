import { Module } from '@nestjs/common';
import { DatagouvRepository } from './datagouv.repository';
import { UploadMonthlyStatisticsCron } from './cron/upload-monthly-statistics';
import { CsvFileService } from '../csv-file/csv-file.service';
import { LandbotCustomerModule } from '../landbot-customer/landbot-customer.module';

@Module({
  imports: [LandbotCustomerModule],
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
