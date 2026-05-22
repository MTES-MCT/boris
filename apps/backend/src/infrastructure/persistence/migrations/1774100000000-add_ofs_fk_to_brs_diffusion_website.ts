import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOfsFkToBrsDiffusionWebsite1774100000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS unaccent`);
    await queryRunner.query(
      `ALTER TABLE "brs_diffusion_website" ADD "ofsId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "brs_diffusion_website" ADD "programName" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "brs_diffusion_website" ADD "deliveryMonth" character varying`,
    );
    await queryRunner.query(
      `UPDATE "brs_diffusion_website" bdw
       SET "ofsId" = ofs.id
       FROM "ofs" ofs
       WHERE lower(unaccent(regexp_replace(bdw."ofsName", '[^[:alnum:]]+', '', 'g'))) =
             lower(unaccent(regexp_replace(ofs."name", '[^[:alnum:]]+', '', 'g')))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_brs_diffusion_website_ofs" ON "brs_diffusion_website" ("ofsId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "brs_diffusion_website" ADD CONSTRAINT "FK_brs_diffusion_website_ofs" FOREIGN KEY ("ofsId") REFERENCES "ofs"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "brs_diffusion_website" DROP CONSTRAINT "FK_brs_diffusion_website_ofs"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_brs_diffusion_website_ofs"`,
    );
    await queryRunner.query(
      `ALTER TABLE "brs_diffusion_website" DROP COLUMN "ofsId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "brs_diffusion_website" DROP COLUMN "deliveryMonth"`,
    );
    await queryRunner.query(
      `ALTER TABLE "brs_diffusion_website" DROP COLUMN "programName"`,
    );
  }
}
