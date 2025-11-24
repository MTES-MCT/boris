import { Module } from '@nestjs/common';
import { CsvFileService } from './csv-file.service';

@Module({
  providers: [
    {
      provide: 'CsvFileServiceInterface',
      useClass: CsvFileService,
    },
  ],
  exports: ['CsvFileServiceInterface'],
})
export class CsvFileModule {}
