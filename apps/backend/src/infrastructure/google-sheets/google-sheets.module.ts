import { Module } from '@nestjs/common';
import { GoogleSheetsService } from './google-sheets.service';

@Module({
  providers: [
    {
      provide: 'GoogleSheetsServiceInterface',
      useClass: GoogleSheetsService,
    },
  ],
  exports: ['GoogleSheetsServiceInterface'],
})
export class GoogleSheetsModule {}
