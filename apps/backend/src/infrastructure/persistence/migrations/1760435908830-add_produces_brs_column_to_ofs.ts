import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProducesBrsColumnToOfs1760435908830
  implements MigrationInterface
{
  name = 'AddProducesBrsColumnToOfs1760435908830';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ofs" ADD "producesBrs" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ofs" DROP COLUMN "producesBrs"`);
  }
}
