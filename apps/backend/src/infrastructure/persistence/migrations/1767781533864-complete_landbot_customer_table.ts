import { MigrationInterface, QueryRunner } from 'typeorm';

export class CompleteLandbotCustomerTable1767781533864
  implements MigrationInterface
{
  name = 'CompleteLandbotCustomerTable1767781533864';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."landbot_customer_handicap_enum" AS ENUM('Oui', 'NON')`,
    );
    await queryRunner.query(
      `ALTER TABLE "landbot_customer" ADD "handicap" "public"."landbot_customer_handicap_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."landbot_customer_declaration_seul_en_commun_enum" AS ENUM('Seul·e et vous souhaitez acheter seul·e', 'Seul·e mais vous souhaitez acheter avec un·e partenaire', 'En commun')`,
    );
    await queryRunner.query(
      `ALTER TABLE "landbot_customer" ADD "declaration_seul_en_commun" "public"."landbot_customer_declaration_seul_en_commun_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."landbot_customer_miseenrelation_yesno_enum" AS ENUM('Oui', 'NON')`,
    );
    await queryRunner.query(
      `ALTER TABLE "landbot_customer" ADD "miseenrelation_yesno" "public"."landbot_customer_miseenrelation_yesno_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "landbot_customer" ADD "ressources" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "landbot_customer" DROP COLUMN "ressources"`,
    );
    await queryRunner.query(
      `ALTER TABLE "landbot_customer" DROP COLUMN "miseenrelation_yesno"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."landbot_customer_miseenrelation_yesno_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "landbot_customer" DROP COLUMN "declaration_seul_en_commun"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."landbot_customer_declaration_seul_en_commun_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "landbot_customer" DROP COLUMN "handicap"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."landbot_customer_handicap_enum"`,
    );
  }
}
