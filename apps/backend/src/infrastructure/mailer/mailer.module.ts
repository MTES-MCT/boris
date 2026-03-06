import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';

@Module({
  providers: [
    {
      provide: 'MailerServiceInterface',
      useClass: MailerService,
    },
  ],
  exports: ['MailerServiceInterface'],
})
export class MailerModule {}
