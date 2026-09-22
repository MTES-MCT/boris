import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeBrsOrganisationNamesNullable1790000000000
  implements MigrationInterface
{
  name = 'MakeBrsOrganisationNamesNullable1790000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "brs_diffusion_website" ALTER COLUMN "distributorName" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "brs_diffusion_website" ALTER COLUMN "ofsName" DROP NOT NULL`,
    );
    await queryRunner.query(
      `UPDATE "brs_diffusion_website" SET "distributorName" = NULL WHERE btrim("distributorName") = ''`,
    );
    await queryRunner.query(
      `UPDATE "brs_diffusion_website" SET "ofsName" = NULL WHERE btrim("ofsName") = ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "brs_diffusion_website" SET "distributorName" = '' WHERE "distributorName" IS NULL`,
    );
    await queryRunner.query(
      `UPDATE "brs_diffusion_website" SET "ofsName" = '' WHERE "ofsName" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "brs_diffusion_website" ALTER COLUMN "distributorName" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "brs_diffusion_website" ALTER COLUMN "ofsName" SET NOT NULL`,
    );
  }
}
