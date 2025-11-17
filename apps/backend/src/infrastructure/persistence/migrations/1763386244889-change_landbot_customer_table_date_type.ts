import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeLandbotCustomerTableDateType1763386244889
  implements MigrationInterface
{
  name = 'ChangeLandbotCustomerTableDateType1763386244889';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "landbot_customer" ADD "desiredCity" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "landbot_customer" DROP COLUMN "date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "landbot_customer" ADD "date" TIMESTAMP WITH TIME ZONE NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "landbot_customer" DROP COLUMN "date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "landbot_customer" ADD "date" date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "landbot_customer" DROP COLUMN "desiredCity"`,
    );
  }
}
