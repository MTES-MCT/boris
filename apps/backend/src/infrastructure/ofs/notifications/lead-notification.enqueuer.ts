import { BadRequestException, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { LeadNotificationOptions } from 'src/domain/ofs/lead-notification-options';

interface ContactReadiness {
  hasRefusedConnection: boolean | null;
  email: string | null;
  contribution: number | null;
  resources: number | null;
  isFromLandbot: boolean;
  hasLocation: boolean;
}

@Injectable()
export class LeadNotificationEnqueuer {
  public async enqueue(
    manager: EntityManager,
    simulationId: string,
    options: LeadNotificationOptions = {},
  ): Promise<void> {
    // Ordinary form-step saves do not create notification work.
    if (!options.submitLead && !options.suppressLeadNotifications) return;
    if (!manager.queryRunner?.isTransactionActive) {
      throw new Error(
        'Lead notifications must be enqueued inside the contact save transaction',
      );
    }
    const contacts: ContactReadiness[] = await manager.query(
      `SELECT s."hasRefusedConnection", s.email, s.contribution, s.resources, s."isFromLandbot",
         EXISTS (SELECT 1 FROM location l WHERE l."eligibilitySimulationId" = s.id
                 AND l."departementId" IS NOT NULL) AS "hasLocation"
       FROM eligibility_simulation s WHERE s.id = $1`,
      [simulationId],
    );
    const contact = contacts[0];
    if (
      !contact ||
      contact.hasRefusedConnection !== false ||
      !contact.email?.trim() ||
      contact.contribution === null ||
      contact.resources === null ||
      !contact.hasLocation
    ) {
      if (options.submitLead && !options.suppressLeadNotifications) {
        throw new BadRequestException(
          'La piste doit contenir les coordonnées, le consentement, une localisation et les informations financières.',
        );
      }
      return;
    }
    const status =
      contact.isFromLandbot || options.suppressLeadNotifications
        ? 'processed'
        : 'pending';
    const events: { id: string }[] = await manager.query(
      `INSERT INTO portal_lead_notification_event ("simulationId", status)
       VALUES ($1, $2) ON CONFLICT ("simulationId") DO NOTHING RETURNING id`,
      [simulationId, status],
    );
    if (events.length && status === 'pending') {
      // The worker is woken after commit; OFS/subscriber resolution happens there.
      await manager.query("SELECT pg_notify('portal_lead_notifications', '')");
    }
  }
}
