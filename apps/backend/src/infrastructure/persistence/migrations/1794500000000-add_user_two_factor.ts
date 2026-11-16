import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserTwoFactor1794500000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user"
      ADD "twoFactorVersion" uuid,
      ADD "twoFactorSecret" text,
      ADD "twoFactorRecoveryCodes" jsonb NOT NULL DEFAULT '[]'::jsonb,
      ADD "twoFactorLastUsedStep" bigint`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user"
      DROP COLUMN "twoFactorLastUsedStep",
      DROP COLUMN "twoFactorRecoveryCodes",
      DROP COLUMN "twoFactorSecret",
      DROP COLUMN "twoFactorVersion"`);
  }
}
