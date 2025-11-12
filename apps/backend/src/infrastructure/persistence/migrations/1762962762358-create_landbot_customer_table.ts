import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLandbotCustomerTable1762962762358
  implements MigrationInterface
{
  name = 'CreateLandbotCustomerTable1762962762358';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."landbot_customer_eligibility_enum" AS ENUM('1', '2', '3', '4')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."landbot_customer_brsknowledge_enum" AS ENUM('Oui', 'Non', 'Je ne suis pas sûr·e')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."landbot_customer_realestatesituation_enum" AS ENUM('propriétaire d''un logement', 'locataire d''un logement social', 'locataire d''un logement privé', 'hebergé·e', 'dans une autre situation immobilière')`,
    );
    await queryRunner.query(
      `CREATE TABLE "landbot_customer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" date NOT NULL, "eligibility" "public"."landbot_customer_eligibility_enum" NOT NULL, "brsKnowledge" "public"."landbot_customer_brsknowledge_enum" NOT NULL, "realEstateSituation" "public"."landbot_customer_realestatesituation_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "departementId" uuid, CONSTRAINT "PK_a5f8120f4a58259b52e21d9901c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "landbot_customer" ADD CONSTRAINT "FK_caa6d120ba73b7b8d764242ed85" FOREIGN KEY ("departementId") REFERENCES "departement"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "landbot_customer" DROP CONSTRAINT "FK_caa6d120ba73b7b8d764242ed85"`,
    );
    await queryRunner.query(`DROP TABLE "landbot_customer"`);
    await queryRunner.query(
      `DROP TYPE "public"."landbot_customer_realestatesituation_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."landbot_customer_brsknowledge_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."landbot_customer_eligibility_enum"`,
    );
  }
}
