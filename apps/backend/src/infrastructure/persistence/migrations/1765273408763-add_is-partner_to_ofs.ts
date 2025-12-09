import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsPartnerToOfs1765273408763 implements MigrationInterface {
  name = 'AddIsPartnerToOfs1765273408763';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ofs" ADD "isPartner" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ofs" DROP COLUMN "isPartner"`);
  }
}
