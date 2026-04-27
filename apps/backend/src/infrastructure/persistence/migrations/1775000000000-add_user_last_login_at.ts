import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserLastLoginAt1775000000000 implements MigrationInterface {
  name = 'AddUserLastLoginAt1775000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "lastLoginAt" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastLoginAt"`);
  }
}
