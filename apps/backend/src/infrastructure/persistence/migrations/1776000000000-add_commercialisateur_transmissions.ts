import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCommercialisateurTransmissions1776000000000
  implements MigrationInterface
{
  name = 'AddCommercialisateurTransmissions1776000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."user_roles_enum" ADD VALUE IF NOT EXISTS 'commercialisateur'`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "distributorId" uuid`);
    await queryRunner.query(
      `CREATE TYPE "public"."commercial_transmission_scopetype_enum" AS ENUM('ALL', 'GEOGRAPHIC')`,
    );
    await queryRunner.query(
      `CREATE TABLE "commercial_transmission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ofsId" uuid NOT NULL, "distributorId" uuid NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "scopeType" "public"."commercial_transmission_scopetype_enum" NOT NULL DEFAULT 'ALL', "inseeCodes" character varying array NOT NULL DEFAULT '{}', "departementCodes" character varying array NOT NULL DEFAULT '{}', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_commercial_transmission_ofs_distributor" UNIQUE ("ofsId", "distributorId"), CONSTRAINT "PK_commercial_transmission" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_commercial_transmission_distributor_active" ON "commercial_transmission" ("distributorId", "isActive")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_commercial_transmission_ofs" ON "commercial_transmission" ("ofsId")`,
    );
    await queryRunner.query(
      `CREATE TABLE "distributor_eligibility_simulation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "distributorId" uuid NOT NULL, "eligibilitySimulationId" uuid NOT NULL, "action" "public"."ofs_eligibility_simulation_action_enum", "status" "public"."ofs_eligibility_simulation_status_enum", "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_distributor_eligibility_simulation_distributor_simulation" UNIQUE ("distributorId", "eligibilitySimulationId"), CONSTRAINT "PK_distributor_eligibility_simulation" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_distributor_eligibility_simulation_distributor" ON "distributor_eligibility_simulation" ("distributorId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_distributor_eligibility_simulation_simulation" ON "distributor_eligibility_simulation" ("eligibilitySimulationId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_user_distributor" FOREIGN KEY ("distributorId") REFERENCES "distributor"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "commercial_transmission" ADD CONSTRAINT "FK_commercial_transmission_ofs" FOREIGN KEY ("ofsId") REFERENCES "ofs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "commercial_transmission" ADD CONSTRAINT "FK_commercial_transmission_distributor" FOREIGN KEY ("distributorId") REFERENCES "distributor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "distributor_eligibility_simulation" ADD CONSTRAINT "FK_distributor_eligibility_simulation_distributor" FOREIGN KEY ("distributorId") REFERENCES "distributor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "distributor_eligibility_simulation" ADD CONSTRAINT "FK_distributor_eligibility_simulation_simulation" FOREIGN KEY ("eligibilitySimulationId") REFERENCES "eligibility_simulation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "distributor_eligibility_simulation" DROP CONSTRAINT "FK_distributor_eligibility_simulation_simulation"`,
    );
    await queryRunner.query(
      `ALTER TABLE "distributor_eligibility_simulation" DROP CONSTRAINT "FK_distributor_eligibility_simulation_distributor"`,
    );
    await queryRunner.query(
      `ALTER TABLE "commercial_transmission" DROP CONSTRAINT "FK_commercial_transmission_distributor"`,
    );
    await queryRunner.query(
      `ALTER TABLE "commercial_transmission" DROP CONSTRAINT "FK_commercial_transmission_ofs"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_user_distributor"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_distributor_eligibility_simulation_simulation"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_distributor_eligibility_simulation_distributor"`,
    );
    await queryRunner.query(`DROP TABLE "distributor_eligibility_simulation"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_commercial_transmission_ofs"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_commercial_transmission_distributor_active"`,
    );
    await queryRunner.query(`DROP TABLE "commercial_transmission"`);
    await queryRunner.query(
      `DROP TYPE "public"."commercial_transmission_scopetype_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "distributorId"`);
  }
}
