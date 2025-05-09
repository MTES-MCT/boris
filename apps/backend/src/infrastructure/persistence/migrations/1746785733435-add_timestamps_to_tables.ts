import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTimestampsToTables1746785733435 implements MigrationInterface {
  name = 'AddTimestampsToTables1746785733435';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "distributor" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "distributor" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "ofs" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "ofs" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "departement" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "departement" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "region" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "region" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "region" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "region" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "departement" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "departement" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(`ALTER TABLE "ofs" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "ofs" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "distributor" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "distributor" DROP COLUMN "createdAt"`,
    );
  }
}
