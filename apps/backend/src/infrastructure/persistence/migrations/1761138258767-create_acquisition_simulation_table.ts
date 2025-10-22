import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAcquisitionSimulationTable1761138258767
  implements MigrationInterface
{
  name = 'CreateAcquisitionSimulationTable1761138258767';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."acquisition_simulation_brszone_enum" AS ENUM('A', 'Abis', 'B1', 'B2', 'C')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."acquisition_simulation_housingtype_enum" AS ENUM('new', 'old')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."acquisition_simulation_ptztype_enum" AS ENUM('collectif', 'individuel')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."acquisition_simulation_condominiumfeesfrequency_enum" AS ENUM('yearly', 'monthly', 'trimestrial')`,
    );
    await queryRunner.query(
      `CREATE TABLE "acquisition_simulation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "housingPrice" integer, "brsZone" "public"."acquisition_simulation_brszone_enum", "surface" integer, "housingType" "public"."acquisition_simulation_housingtype_enum", "ownContribution" integer, "notaryFees" integer, "oneTimeExpenses" integer, "interestRate" double precision, "loanDuration" integer, "inHousePeopleAmount" integer, "fiscalIncome" integer, "ptzType" "public"."acquisition_simulation_ptztype_enum", "brsFees" integer, "yearlyPropertyTax" integer, "yearlyHouseingInsurance" integer, "condominiumFeesFrequency" "public"."acquisition_simulation_condominiumfeesfrequency_enum", "condominiumFees" integer, "monthlyExpenses" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c5ed4b03584319c09f583c091d5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "ofs" ADD "producesBrs" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ofs" DROP COLUMN "producesBrs"`);
    await queryRunner.query(`DROP TABLE "acquisition_simulation"`);
    await queryRunner.query(
      `DROP TYPE "public"."acquisition_simulation_condominiumfeesfrequency_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."acquisition_simulation_ptztype_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."acquisition_simulation_housingtype_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."acquisition_simulation_brszone_enum"`,
    );
  }
}
