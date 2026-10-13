import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProgramSoftDelete1792000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "brs_diffusion_website" ADD "isDeleted" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "brs_diffusion_website" DROP COLUMN "isDeleted"`,
    );
  }
}
