import { MigrationInterface, QueryRunner } from 'typeorm';

export class CompleteLandbotCustomerTable1767785657416
  implements MigrationInterface
{
  name = 'CompleteLandbotCustomerTable1767785657416';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."landbot_customer_disability_enum" AS ENUM('Oui', 'Non')`,
    );
    await queryRunner.query(
      `ALTER TABLE "landbot_customer" ADD "disability" "public"."landbot_customer_disability_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."landbot_customer_declarationtype_enum" AS ENUM('Seul·e et vous souhaitez acheter seul·e', 'Seul·e mais vous souhaitez acheter avec un·e partenaire', 'En commun')`,
    );
    await queryRunner.query(
      `ALTER TABLE "landbot_customer" ADD "declarationType" "public"."landbot_customer_declarationtype_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."landbot_customer_connectionwish_enum" AS ENUM('Oui', 'Non')`,
    );
    await queryRunner.query(
      `ALTER TABLE "landbot_customer" ADD "connectionWish" "public"."landbot_customer_connectionwish_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "landbot_customer" ADD "resources" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "landbot_customer" ADD "hasProvidedEmail" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "landbot_customer" DROP COLUMN "hasProvidedEmail"`,
    );
    await queryRunner.query(
      `ALTER TABLE "landbot_customer" DROP COLUMN "resources"`,
    );
    await queryRunner.query(
      `ALTER TABLE "landbot_customer" DROP COLUMN "connectionWish"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."landbot_customer_connectionwish_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "landbot_customer" DROP COLUMN "declarationType"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."landbot_customer_declarationtype_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "landbot_customer" DROP COLUMN "disability"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."landbot_customer_disability_enum"`,
    );
  }
}
