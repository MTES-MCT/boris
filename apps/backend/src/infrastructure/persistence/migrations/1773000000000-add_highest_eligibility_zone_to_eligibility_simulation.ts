import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddHighestEligibilityZoneToEligibilitySimulation1773000000000
  implements MigrationInterface
{
  name = 'AddHighestEligibilityZoneToEligibilitySimulation1773000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."eligibility_simulation_highesteligibilityzone_enum" AS ENUM('A_AND_ABIS', 'B1', 'B2_AND_C', 'NONE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "eligibility_simulation" ADD "eligibilityCategory" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "eligibility_simulation" ADD "highestEligibilityZone" "public"."eligibility_simulation_highesteligibilityzone_enum" NOT NULL DEFAULT 'NONE'`,
    );
    await queryRunner.query(`
      UPDATE "eligibility_simulation"
      SET
        "eligibilityCategory" = CASE
          WHEN "eligibility" IS NULL THEN NULL
          ELSE ("eligibility"::jsonb ->> 'category')::integer
        END,
        "highestEligibilityZone" = CASE
          WHEN COALESCE(("eligibility"::jsonb ->> 'eligibleZoneAandAbis')::boolean, false) = true THEN 'A_AND_ABIS'::"public"."eligibility_simulation_highesteligibilityzone_enum"
          WHEN COALESCE(("eligibility"::jsonb ->> 'eligibleZoneB1')::boolean, false) = true THEN 'B1'::"public"."eligibility_simulation_highesteligibilityzone_enum"
          WHEN COALESCE(("eligibility"::jsonb ->> 'eligibleZoneB2andC')::boolean, false) = true THEN 'B2_AND_C'::"public"."eligibility_simulation_highesteligibilityzone_enum"
          ELSE 'NONE'::"public"."eligibility_simulation_highesteligibilityzone_enum"
        END
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "eligibility_simulation" DROP COLUMN "highestEligibilityZone"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eligibility_simulation" DROP COLUMN "eligibilityCategory"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."eligibility_simulation_highesteligibilityzone_enum"`,
    );
  }
}
