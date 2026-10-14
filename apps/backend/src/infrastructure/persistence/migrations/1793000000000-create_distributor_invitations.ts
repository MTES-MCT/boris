import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDistributorInvitations1793000000000
  implements MigrationInterface
{
  name = 'CreateDistributorInvitations1793000000000';
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "distributor_invitation" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "ofsId" uuid NOT NULL REFERENCES "ofs"("id") ON DELETE CASCADE,
      "name" varchar(200) NOT NULL, "email" varchar(254) NOT NULL,
      "tokenHash" varchar NOT NULL UNIQUE,
      "status" varchar NOT NULL DEFAULT 'pending' CHECK ("status" IN ('pending', 'accepted', 'cancelled')),
      "expiresAt" timestamptz NOT NULL, "acceptedAt" timestamptz,
      "createdAt" timestamptz NOT NULL DEFAULT now(),
      CONSTRAINT "PK_distributor_invitation" PRIMARY KEY ("id")
    )`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_distributor_invitation_pending" ON "distributor_invitation" ("ofsId", "email") WHERE "status" = 'pending'`,
    );
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "distributor_invitation"');
  }
}
