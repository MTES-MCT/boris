import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterLocationTable1772536901988 implements MigrationInterface {
  name = 'AlterLocationTable1772536901988';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "location" ALTER COLUMN "latitude" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" ALTER COLUMN "longitude" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" ALTER COLUMN "city" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" ALTER COLUMN "citycode" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" ALTER COLUMN "label" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" ALTER COLUMN "municipality" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" ALTER COLUMN "postalCode" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "location" ALTER COLUMN "postalCode" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" ALTER COLUMN "municipality" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" ALTER COLUMN "label" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" ALTER COLUMN "citycode" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" ALTER COLUMN "city" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" ALTER COLUMN "longitude" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" ALTER COLUMN "latitude" SET NOT NULL`,
    );
  }
}
