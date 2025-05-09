import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterOfsColumns1746778804495 implements MigrationInterface {
  name = 'AlterOfsColumns1746778804495';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ofs" ADD "email" character varying`);
    await queryRunner.query(
      `ALTER TABLE "ofs" ALTER COLUMN "websiteUrl" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "ofs" ALTER COLUMN "phone" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ofs" ALTER COLUMN "phone" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "ofs" ALTER COLUMN "websiteUrl" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "ofs" DROP COLUMN "email"`);
  }
}
