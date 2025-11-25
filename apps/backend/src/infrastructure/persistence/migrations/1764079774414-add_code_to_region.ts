import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCodeToRegion1764079774414 implements MigrationInterface {
  name = 'AddCodeToRegion1764079774414';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "region" ADD "code" character varying(2) NOT NULL DEFAULT '00'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "region" DROP COLUMN "code"`);
  }
}
