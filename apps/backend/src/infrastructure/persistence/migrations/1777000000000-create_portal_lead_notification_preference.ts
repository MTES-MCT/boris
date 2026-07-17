import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePortalLeadNotificationPreference1777000000000
  implements MigrationInterface
{
  name = 'CreatePortalLeadNotificationPreference1777000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."portal_lead_notification_preference_frequency_enum" AS ENUM('daily', 'weekly')`,
    );
    await queryRunner.query(
      `CREATE TABLE "portal_lead_notification_preference" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "ofsId" uuid NOT NULL, "frequency" "public"."portal_lead_notification_preference_frequency_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_portal_lead_notification_preference_user_ofs" UNIQUE ("userId", "ofsId"), CONSTRAINT "PK_portal_lead_notification_preference" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_portal_lead_notification_preference_user" ON "portal_lead_notification_preference" ("userId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_portal_lead_notification_preference_ofs" ON "portal_lead_notification_preference" ("ofsId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "portal_lead_notification_preference" ADD CONSTRAINT "FK_portal_lead_notification_preference_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "portal_lead_notification_preference" ADD CONSTRAINT "FK_portal_lead_notification_preference_ofs" FOREIGN KEY ("ofsId") REFERENCES "ofs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "portal_lead_notification_preference" DROP CONSTRAINT "FK_portal_lead_notification_preference_ofs"`,
    );
    await queryRunner.query(
      `ALTER TABLE "portal_lead_notification_preference" DROP CONSTRAINT "FK_portal_lead_notification_preference_user"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_portal_lead_notification_preference_ofs"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_portal_lead_notification_preference_user"`,
    );
    await queryRunner.query(
      `DROP TABLE "portal_lead_notification_preference"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."portal_lead_notification_preference_frequency_enum"`,
    );
  }
}
