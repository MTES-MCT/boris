import { Cron } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ImportLandbotCustomersCron {
  @Cron('*/5 * * * * *', { timeZone: 'Europe/Paris' })
  execute() {
    console.log('Bonjiourno');
  }
}
