import { MigrationInterface, QueryRunner } from 'typeorm';

export class SharePortalInvitations1795200000000 implements MigrationInterface {
  name = 'SharePortalInvitations1795200000000';
  async up(runner: QueryRunner): Promise<void> {
    await runner.query(
      'ALTER TABLE "distributor_invitation" RENAME TO "portal_invitation"',
    );
    await runner.query(
      `ALTER TABLE "portal_invitation" ADD "role" varchar NOT NULL DEFAULT 'commercialisateur' CHECK ("role" IN ('ofs', 'commercialisateur'))`,
    );
    await runner.query(
      `ALTER TABLE "portal_invitation" ALTER COLUMN "name" SET DEFAULT ''`,
    );
    await runner.query('DROP INDEX "UQ_distributor_invitation_pending"');
    await runner.query(
      `CREATE UNIQUE INDEX "UQ_portal_invitation_pending" ON "portal_invitation" ("ofsId", "email", "role") WHERE "status" = 'pending'`,
    );
    await runner.query(
      'ALTER TABLE "user" ADD "firstName" varchar(100), ADD "lastName" varchar(100)',
    );
  }
  async down(runner: QueryRunner): Promise<void> {
    await runner.query(
      'ALTER TABLE "user" DROP COLUMN "firstName", DROP COLUMN "lastName"',
    );
    await runner.query(`DELETE FROM "portal_invitation" WHERE "role" = 'ofs'`);
    await runner.query('DROP INDEX "UQ_portal_invitation_pending"');
    await runner.query('ALTER TABLE "portal_invitation" DROP COLUMN "role"');
    await runner.query(
      'ALTER TABLE "portal_invitation" ALTER COLUMN "name" DROP DEFAULT',
    );
    await runner.query(
      'ALTER TABLE "portal_invitation" RENAME TO "distributor_invitation"',
    );
    await runner.query(
      `CREATE UNIQUE INDEX "UQ_distributor_invitation_pending" ON "distributor_invitation" ("ofsId", "email") WHERE "status" = 'pending'`,
    );
  }
}
