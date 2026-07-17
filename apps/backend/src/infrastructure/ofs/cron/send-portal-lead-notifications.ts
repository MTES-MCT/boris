import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { MailerServiceInterface } from 'src/domain/mailer/mailer.service.interface';
import { Repository } from 'typeorm';
import { EligibilitySimulationRepository } from 'src/infrastructure/eligibility-simulation/eligibility-simulation.repository';
import {
  PortalLeadNotificationFrequency,
  PortalLeadNotificationPreferenceEntity,
} from '../portal-lead-notification-preference.entity';
import { UserRole } from 'src/domain/user/user-role.enum';

@Injectable()
export class SendPortalLeadNotificationsCron {
  constructor(
    @InjectRepository(PortalLeadNotificationPreferenceEntity)
    private readonly preferenceRepository: Repository<PortalLeadNotificationPreferenceEntity>,
    private readonly eligibilitySimulationRepository: EligibilitySimulationRepository,
    @Inject('MailerServiceInterface')
    private readonly mailerService: MailerServiceInterface,
  ) {}

  @Cron('0 6 * * 1-5', {
    timeZone: 'Europe/Paris',
    disabled: process.env.CRON_TASKS !== 'enabled',
  })
  public async execute(date = new Date()) {
    const preferences = await this.findDuePreferences(date);
    const templateId = Number(
      process.env.OFS_PORTAL_LEAD_NOTIFICATION_TEMPLATE_ID || '0',
    );
    const portalUrl = process.env.OFS_PORTAL_URL;

    if (!templateId || !portalUrl) {
      return;
    }

    for (const preference of preferences) {
      const window = this.resolveNotificationWindow(preference.frequency, date);
      const count =
        await this.eligibilitySimulationRepository.countPortalContactsByOfsScope(
          {
            ofsId: preference.ofsId,
            departementIds: preference.ofs.departements.map(
              (departement) => departement.id,
            ),
            startDate: window.startDate,
            endDate: window.endDate,
          },
        );

      if (count === 0) {
        continue;
      }

      const subject = `Vous avez ${count} nouvelle${count > 1 ? 's' : ''} piste${count > 1 ? 's' : ''} pour ${preference.ofs.name}`;

      await this.mailerService.sendEmail(
        [
          {
            email: preference.user.email,
            name: preference.user.email,
            params: {
              count,
              ofsName: preference.ofs.name,
              dashboardUrl: `${portalUrl.replace(/\/$/, '')}/ofs/${preference.ofsId}`,
            },
          },
        ],
        subject,
        templateId,
      );
    }
  }

  private async findDuePreferences(date: Date) {
    const weekday = this.getParisWeekday(date);
    const frequencies = [PortalLeadNotificationFrequency.DAILY];

    if (weekday === 1) {
      frequencies.push(PortalLeadNotificationFrequency.WEEKLY);
    }

    return this.preferenceRepository
      .createQueryBuilder('preference')
      .innerJoinAndSelect('preference.user', 'user')
      .innerJoinAndSelect('preference.ofs', 'ofs')
      .innerJoinAndSelect('ofs.departements', 'departements')
      .where('preference.frequency IN (:...frequencies)', { frequencies })
      .andWhere('user."isActive" = true')
      .andWhere(':ofsRole = ANY(user.roles)', { ofsRole: UserRole.OFS })
      .andWhere(
        `EXISTS (
          SELECT 1 FROM user_ofs
          WHERE user_ofs."userId" = user.id
          AND user_ofs."ofsId" = ofs.id
        )`,
      )
      .orderBy('user.email', 'ASC')
      .addOrderBy('ofs.name', 'ASC')
      .getMany();
  }

  private resolveNotificationWindow(
    frequency: PortalLeadNotificationFrequency,
    date: Date,
  ) {
    const today = this.getParisDate(date);
    const start = new Date(`${today}T00:00:00.000Z`);
    const end = new Date(start);

    if (frequency === PortalLeadNotificationFrequency.WEEKLY) {
      start.setUTCDate(start.getUTCDate() - 7);
      end.setUTCDate(end.getUTCDate() - 1);
    } else {
      const daysBack = this.getParisWeekday(date) === 1 ? 3 : 1;
      start.setUTCDate(start.getUTCDate() - daysBack);
      end.setUTCDate(end.getUTCDate() - 1);
    }

    return {
      startDate: this.toDateString(start),
      endDate: this.toDateString(end),
    };
  }

  private getParisDate(date: Date) {
    const formatter = new Intl.DateTimeFormat('fr-FR', {
      timeZone: 'Europe/Paris',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const parts = formatter.formatToParts(date);
    const year = parts.find((part) => part.type === 'year')?.value;
    const month = parts.find((part) => part.type === 'month')?.value;
    const day = parts.find((part) => part.type === 'day')?.value;

    return `${year}-${month}-${day}`;
  }

  private toDateString(date: Date) {
    return date.toISOString().slice(0, 10);
  }

  private getParisWeekday(date: Date) {
    const weekday = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Europe/Paris',
      weekday: 'short',
    }).format(date);

    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(weekday);
  }
}
