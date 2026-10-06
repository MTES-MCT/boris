import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

export interface LeadNotificationEvent {
  id: string;
  simulationId: string;
  attempts: number;
  claimToken: string;
}

export interface LeadNotificationDelivery {
  id: string;
  eventId: string;
  attempts: number;
  claimToken: string;
}

export interface LeadNotificationRecipient {
  email: string;
  ofsId: string;
  ofsName: string;
}

@Injectable()
export class InstantLeadNotificationStore {
  constructor(private readonly dataSource: DataSource) {}

  public async claimEvent(): Promise<LeadNotificationEvent | undefined> {
    const rows: LeadNotificationEvent[] = await this.dataSource.query(`
      WITH next_event AS (
        SELECT id FROM portal_lead_notification_event
        WHERE status = 'pending' AND "nextAttemptAt" <= now()
          AND ("lockedUntil" IS NULL OR "lockedUntil" < now())
        ORDER BY "nextAttemptAt", id LIMIT 1 FOR UPDATE SKIP LOCKED
      ), claimed AS (
        UPDATE portal_lead_notification_event e
        SET "lockedUntil" = now() + interval '2 minutes',
            "claimToken" = uuid_generate_v4(), attempts = attempts + 1
        FROM next_event n WHERE e.id = n.id
        RETURNING e.id, e."simulationId", e.attempts, e."claimToken"
      ) SELECT * FROM claimed
    `);
    return rows[0];
  }

  public async resolveEvent(event: LeadNotificationEvent): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      // Fence stale workers and commit recipient expansion and completion together.
      const owned: { id: string }[] = await manager.query(
        `SELECT id FROM portal_lead_notification_event WHERE id = $1 AND "claimToken" = $2
         AND status = 'pending' FOR UPDATE`,
        [event.id, event.claimToken],
      );
      if (!owned.length) return;
      const contacts: { id: string }[] = await manager.query(
        `SELECT s.id FROM eligibility_simulation s WHERE s.id = $1
         AND s."hasRefusedConnection" = false AND NULLIF(TRIM(s.email), '') IS NOT NULL
         AND s.contribution IS NOT NULL AND s.resources IS NOT NULL AND s."isFromLandbot" = false
         AND EXISTS (SELECT 1 FROM location l WHERE l."eligibilitySimulationId" = s.id
                     AND l."departementId" IS NOT NULL)`,
        [event.simulationId],
      );
      if (contacts.length) {
        await manager.query(
          `INSERT INTO portal_lead_notification_delivery ("eventId", "ofsId", "userId")
           SELECT DISTINCT $1::uuid, od."ofsId", p."userId" FROM location l
           JOIN ofs_departement od ON od."departementId" = l."departementId"
           JOIN portal_lead_notification_preference p ON p."ofsId" = od."ofsId"
           JOIN "user" u ON u.id = p."userId"
           JOIN user_ofs uo ON uo."userId" = u.id AND uo."ofsId" = od."ofsId"
           WHERE l."eligibilitySimulationId" = $2 AND p.frequency::text = 'instant'
             AND u."isActive" = true AND 'ofs' = ANY(u.roles)
           ON CONFLICT ("eventId", "ofsId", "userId") DO NOTHING`,
          [event.id, event.simulationId],
        );
      }
      await manager.query(
        `UPDATE portal_lead_notification_event
         SET status = $3, "lockedUntil" = NULL, "claimToken" = NULL, "lastError" = NULL
         WHERE id = $1 AND "claimToken" = $2`,
        [
          event.id,
          event.claimToken,
          contacts.length ? 'processed' : 'cancelled',
        ],
      );
    });
  }

  public async retryEvent(event: LeadNotificationEvent): Promise<void> {
    const delaySeconds = Math.min(
      3600,
      30 * 2 ** Math.min(event.attempts - 1, 7),
    );
    await this.dataSource.query(
      `UPDATE portal_lead_notification_event
       SET status = $3, "nextAttemptAt" = now() + $4 * interval '1 second',
           "lockedUntil" = NULL, "claimToken" = NULL, "lastError" = 'Recipient resolution failed'
       WHERE id = $1 AND "claimToken" = $2`,
      [
        event.id,
        event.claimToken,
        event.attempts >= 10 ? 'failed' : 'pending',
        delaySeconds,
      ],
    );
  }

  public async claim(): Promise<LeadNotificationDelivery | undefined> {
    const rows: LeadNotificationDelivery[] = await this.dataSource.query(`
      WITH next_delivery AS (
        SELECT id FROM portal_lead_notification_delivery
        WHERE status = 'pending' AND "nextAttemptAt" <= now()
          AND ("lockedUntil" IS NULL OR "lockedUntil" < now())
        ORDER BY "nextAttemptAt", id LIMIT 1 FOR UPDATE SKIP LOCKED
      ), claimed AS (
        UPDATE portal_lead_notification_delivery d
        SET "lockedUntil" = now() + interval '2 minutes',
            "claimToken" = uuid_generate_v4(), attempts = attempts + 1
        FROM next_delivery n WHERE d.id = n.id
        RETURNING d.id, d."eventId", d.attempts, d."claimToken"
      )
      SELECT * FROM claimed
    `);
    return rows[0];
  }

  public async findRecipient(
    id: string,
  ): Promise<LeadNotificationRecipient | undefined> {
    const rows: LeadNotificationRecipient[] = await this.dataSource.query(
      `
      SELECT u.email, o.id AS "ofsId", o.name AS "ofsName"
      FROM portal_lead_notification_delivery d
      JOIN portal_lead_notification_event e ON e.id = d."eventId"
      JOIN "user" u ON u.id = d."userId"
      JOIN ofs o ON o.id = d."ofsId"
      JOIN user_ofs uo ON uo."userId" = u.id AND uo."ofsId" = o.id
      JOIN portal_lead_notification_preference p ON p."userId" = u.id AND p."ofsId" = o.id
      JOIN eligibility_simulation s ON s.id = e."simulationId"
      WHERE d.id = $1 AND p.frequency::text = 'instant'
        AND u."isActive" = true AND 'ofs' = ANY(u.roles)
        AND s."hasRefusedConnection" = false AND s.email IS NOT NULL
        AND s.contribution IS NOT NULL AND s.resources IS NOT NULL
        AND EXISTS (
          SELECT 1 FROM location l JOIN ofs_departement od ON od."departementId" = l."departementId"
          WHERE l."eligibilitySimulationId" = s.id AND od."ofsId" = o.id
        )
    `,
      [id],
    );
    return rows[0];
  }

  public async complete(
    delivery: LeadNotificationDelivery,
    status: 'sent' | 'cancelled',
  ): Promise<void> {
    await this.dataSource.query(
      `
      UPDATE portal_lead_notification_delivery
      SET status = $3, "sentAt" = CASE WHEN $3 = 'sent' THEN now() ELSE NULL END,
          "lockedUntil" = NULL, "claimToken" = NULL, "lastError" = NULL
      WHERE id = $1 AND "claimToken" = $2
    `,
      [delivery.id, delivery.claimToken, status],
    );
  }

  public async retry(delivery: LeadNotificationDelivery): Promise<void> {
    // Cap delays at one hour; terminal failures remain inspectable for operators.
    const delaySeconds = Math.min(
      3600,
      30 * 2 ** Math.min(delivery.attempts - 1, 7),
    );
    await this.dataSource.query(
      `
      UPDATE portal_lead_notification_delivery
      SET status = $3, "nextAttemptAt" = now() + $4 * interval '1 second',
          "lockedUntil" = NULL, "claimToken" = NULL, "lastError" = 'Email delivery failed'
      WHERE id = $1 AND "claimToken" = $2
    `,
      [
        delivery.id,
        delivery.claimToken,
        delivery.attempts >= 10 ? 'failed' : 'pending',
        delaySeconds,
      ],
    );
  }
}
