import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOfsEligibilitySimulationTable1775000000000
  implements MigrationInterface
{
  name = 'CreateOfsEligibilitySimulationTable1775000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."ofs_eligibility_simulation_action_enum" AS ENUM('RECONTACTED', 'NOT_RECONTACTED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."ofs_eligibility_simulation_status_enum" AS ENUM('NOT_INTERESTED', 'NO_RESPONSE', 'EXCHANGE_IN_PROGRESS', 'NOT_FINANCEABLE', 'WAITING_FOR_LOAN', 'HAS_SIGNED_BRS')`,
    );
    await queryRunner.query(
      `CREATE TABLE "ofs_eligibility_simulation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ofsId" uuid NOT NULL, "eligibilitySimulationId" uuid NOT NULL, "action" "public"."ofs_eligibility_simulation_action_enum", "status" "public"."ofs_eligibility_simulation_status_enum", "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ofs_eligibility_simulation_ofs_simulation" UNIQUE ("ofsId", "eligibilitySimulationId"), CONSTRAINT "PK_f0c70ea027c8bd8d4617fbe92f0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ofs_eligibility_simulation_ofs" ON "ofs_eligibility_simulation" ("ofsId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ofs_eligibility_simulation_simulation" ON "ofs_eligibility_simulation" ("eligibilitySimulationId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "ofs_eligibility_simulation" ADD CONSTRAINT "FK_ofs_eligibility_simulation_ofs" FOREIGN KEY ("ofsId") REFERENCES "ofs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ofs_eligibility_simulation" ADD CONSTRAINT "FK_ofs_eligibility_simulation_simulation" FOREIGN KEY ("eligibilitySimulationId") REFERENCES "eligibility_simulation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ofs_eligibility_simulation" DROP CONSTRAINT "FK_ofs_eligibility_simulation_simulation"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ofs_eligibility_simulation" DROP CONSTRAINT "FK_ofs_eligibility_simulation_ofs"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ofs_eligibility_simulation_simulation"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ofs_eligibility_simulation_ofs"`,
    );
    await queryRunner.query(`DROP TABLE "ofs_eligibility_simulation"`);
    await queryRunner.query(
      `DROP TYPE "public"."ofs_eligibility_simulation_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."ofs_eligibility_simulation_action_enum"`,
    );
  }
}
