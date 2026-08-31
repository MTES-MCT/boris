import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDistributorAndHousingTypeToBrsDiffusionWebsite1780000000000
  implements MigrationInterface
{
  name = 'AddDistributorAndHousingTypeToBrsDiffusionWebsite1780000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "brs_diffusion_website" ADD "distributorId" uuid`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."brs_diffusion_website_housingtype_enum" AS ENUM('new', 'old')`,
    );
    await queryRunner.query(
      `ALTER TABLE "brs_diffusion_website" ADD "housingType" "public"."brs_diffusion_website_housingtype_enum" NOT NULL DEFAULT 'new'`,
    );
    await queryRunner.query(
      `UPDATE "brs_diffusion_website" bdw
       SET "distributorId" = distributor.id
       FROM "distributor" distributor
       WHERE lower(unaccent(regexp_replace(bdw."distributorName", '[^[:alnum:]]+', '', 'g'))) =
             lower(unaccent(regexp_replace(distributor."name", '[^[:alnum:]]+', '', 'g')))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_brs_diffusion_website_distributor" ON "brs_diffusion_website" ("distributorId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "brs_diffusion_website" ADD CONSTRAINT "FK_brs_diffusion_website_distributor" FOREIGN KEY ("distributorId") REFERENCES "distributor"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "brs_diffusion_website" DROP CONSTRAINT "FK_brs_diffusion_website_distributor"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_brs_diffusion_website_distributor"`,
    );
    await queryRunner.query(
      `ALTER TABLE "brs_diffusion_website" DROP COLUMN "housingType"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."brs_diffusion_website_housingtype_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "brs_diffusion_website" DROP COLUMN "distributorId"`,
    );
  }
}
