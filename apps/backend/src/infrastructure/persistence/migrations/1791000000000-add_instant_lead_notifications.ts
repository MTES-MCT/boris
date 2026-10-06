import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInstantLeadNotifications1791000000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE portal_lead_notification_preference_frequency_enum ADD VALUE 'instant'`,
    );
    await queryRunner.query(`
      CREATE TABLE portal_lead_notification_event (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "simulationId" uuid NOT NULL REFERENCES eligibility_simulation(id) ON DELETE CASCADE,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'cancelled', 'failed')),
        attempts integer NOT NULL DEFAULT 0,
        "nextAttemptAt" timestamptz NOT NULL DEFAULT now(),
        "lockedUntil" timestamptz,
        "claimToken" uuid,
        "lastError" text,
        UNIQUE ("simulationId")
      );
      CREATE TABLE portal_lead_notification_delivery (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "eventId" uuid NOT NULL REFERENCES portal_lead_notification_event(id) ON DELETE CASCADE,
        "userId" uuid NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        "ofsId" uuid NOT NULL REFERENCES ofs(id) ON DELETE CASCADE,
        status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'cancelled', 'failed')),
        attempts integer NOT NULL DEFAULT 0,
        "nextAttemptAt" timestamptz NOT NULL DEFAULT now(),
        "lockedUntil" timestamptz,
        "claimToken" uuid,
        "sentAt" timestamptz,
        "lastError" text,
        UNIQUE ("eventId", "ofsId", "userId")
      );
      CREATE INDEX portal_lead_notification_event_pending
        ON portal_lead_notification_event ("nextAttemptAt") WHERE status = 'pending';
      CREATE INDEX portal_lead_notification_delivery_pending
        ON portal_lead_notification_delivery ("nextAttemptAt") WHERE status = 'pending';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE portal_lead_notification_delivery;
      DROP TABLE portal_lead_notification_event;
      DELETE FROM portal_lead_notification_preference WHERE frequency::text = 'instant';
      ALTER TYPE portal_lead_notification_preference_frequency_enum RENAME TO portal_lead_notification_preference_frequency_enum_old;
      CREATE TYPE portal_lead_notification_preference_frequency_enum AS ENUM ('daily', 'weekly');
      ALTER TABLE portal_lead_notification_preference ALTER COLUMN frequency
        TYPE portal_lead_notification_preference_frequency_enum
        USING frequency::text::portal_lead_notification_preference_frequency_enum;
      DROP TYPE portal_lead_notification_preference_frequency_enum_old;
    `);
  }
}
