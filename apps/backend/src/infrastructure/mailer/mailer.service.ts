import { Injectable } from '@nestjs/common';
import {
  MailerServiceInterface,
  type MailerTo,
} from 'src/domain/mailer/mailer.service.interface';

@Injectable()
export class MailerService implements MailerServiceInterface {
  public baseUrl = 'https://api.brevo.com/v3/smtp/email';
  public defaultSender = {
    email: 'contact@boris.beta.gouv.fr',
    name: 'BoRiS',
  };

  public async sendEmail(
    to: MailerTo[],
    subject: string,
    templateId: number,
  ): Promise<void> {
    const body = JSON.stringify({
      sender: this.defaultSender,
      subject,
      templateId,
      messageVersions: to.map((recipient) => {
        const { email, name, params } = recipient;

        return {
          to: [{ email, name }],
          params,
        };
      }),
    });

    await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY as string,
      },
      body: body,
    });
  }
}
