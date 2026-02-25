import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterEligibilitySimulationTable1772020668569
  implements MigrationInterface
{
  name = 'AlterEligibilitySimulationTable1772020668569';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "eligibility_simulation" DROP COLUMN "secondCoBuyerFormattedTaxableIncome"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eligibility_simulation" DROP COLUMN "firstCoBuyerFormattedTaxableIncome"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eligibility_simulation" ADD "firstCoBuyerTaxableIncome" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "eligibility_simulation" ADD "secondCoBuyerTaxableIncome" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "eligibility_simulation" DROP COLUMN "secondCoBuyerTaxableIncome"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eligibility_simulation" DROP COLUMN "firstCoBuyerTaxableIncome"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eligibility_simulation" ADD "firstCoBuyerFormattedTaxableIncome" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "eligibility_simulation" ADD "secondCoBuyerFormattedTaxableIncome" character varying`,
    );
  }
}
