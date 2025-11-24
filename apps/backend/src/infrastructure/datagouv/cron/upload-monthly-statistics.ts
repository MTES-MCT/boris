import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { CsvFileServiceInterface } from 'src/domain/csv-file/csv-file.service.interface';
import { DatagouvRepositoryInterface } from 'src/domain/datagouv/datagouv.repository.interface';

@Injectable()
export class UploadMonthlyStatisticsCron {
  constructor(
    @Inject('DatagouvRepositoryInterface')
    private readonly datagouvRepository: DatagouvRepositoryInterface,
    @Inject('CsvFileServiceInterface')
    private readonly csvFileService: CsvFileServiceInterface,
  ) {}

  @Cron('*/10 * * * * *', { timeZone: 'Europe/Paris' })
  public async execute() {
    // console.log('Upload des statistiques mensuelles...');

    // const headers = ['name', 'age', 'city'];
    // const filePath = 'create-test.csv';
    // const rows = [
    //   { name: 'John', age: '30', city: 'Paris' },
    //   { name: 'Jane', age: '25', city: 'Lyon' },
    // ];

    // await this.csvFileService.create(headers, filePath, rows);

    try {
      await this.datagouvRepository.uploadCsvFile(
        'data.csv',
        process.env.DATAGOUV_API_KEY as string,
        process.env.DATAGOUV_DATASET_ID as string,
      );
    } catch (error) {
      console.error('Error uploading monthly statistics:', error);
    }
  }
}
