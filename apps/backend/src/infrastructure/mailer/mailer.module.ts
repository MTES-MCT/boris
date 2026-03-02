import { Module } from '@nestjs/common';
import { BREVO_API_KEY, MailerService } from './mailer.service';

@Module({
  providers: [
    {
      provide: BREVO_API_KEY,
      useValue: process.env.BREVO_API_KEY ?? '',
    },
    {
      provide: 'MailerServiceInterface',
      useClass: MailerService,
    },
  ],
  exports: ['MailerServiceInterface'],
})
export class MailerModule {}
