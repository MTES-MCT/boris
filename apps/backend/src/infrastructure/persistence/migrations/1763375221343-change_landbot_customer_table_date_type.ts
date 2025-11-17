import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeLandbotCustomerTableDateType1763375221343
  implements MigrationInterface
{
  name = 'ChangeLandbotCustomerTableDateType1763375221343';

  public async up(queryRunner: QueryRunner): Promise<void> {
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
  }
}
