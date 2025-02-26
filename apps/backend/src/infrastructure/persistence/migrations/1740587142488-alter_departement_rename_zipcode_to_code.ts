import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterDepartementRenameZipcodeToCode1740587142488
  implements MigrationInterface
{
  name = 'AlterDepartementRenameZipcodeToCode1740587142488';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "departement" RENAME COLUMN "zipcode" TO "code"`,
    );
    await queryRunner.query(`ALTER TABLE "departement" DROP COLUMN "code"`);
    await queryRunner.query(
      `ALTER TABLE "departement" ADD "code" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "departement" DROP COLUMN "code"`);
    await queryRunner.query(
      `ALTER TABLE "departement" ADD "code" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "departement" RENAME COLUMN "code" TO "zipcode"`,
    );
  }
}
