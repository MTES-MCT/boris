import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsFromLandbotEligibilitySimulationTable1772642156555
  implements MigrationInterface
{
  name = 'AddIsFromLandbotEligibilitySimulationTable1772642156555';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "eligibility_simulation" ADD "isFromLandbot" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "eligibility_simulation" ADD "landbotDate" TIMESTAMP WITH TIME ZONE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "eligibility_simulation" DROP COLUMN "landbotDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eligibility_simulation" DROP COLUMN "isFromLandbot"`,
    );
  }
}
