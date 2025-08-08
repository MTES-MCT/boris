import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBrsDiffusionWebsiteTable1754302189501
  implements MigrationInterface
{
  name = 'CreateBrsDiffusionWebsiteTable1754302189501';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "brs_diffusion_website" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "source" character varying NOT NULL, "distributorName" character varying NOT NULL, "ofsName" character varying NOT NULL, "city" character varying NOT NULL, "zipcode" character varying NOT NULL, "address" character varying NOT NULL, "inseeCode" character varying NOT NULL, "latitude" double precision NOT NULL, "longitude" double precision NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "regionId" uuid, "departementId" uuid, CONSTRAINT "PK_858887ac745bd72e497a206c478" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "brs_diffusion_website" ADD CONSTRAINT "FK_a50dcbca0843123f2f1b05e861b" FOREIGN KEY ("regionId") REFERENCES "region"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "brs_diffusion_website" ADD CONSTRAINT "FK_62f52dc4eed974910ba369b7541" FOREIGN KEY ("departementId") REFERENCES "departement"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "brs_diffusion_website" DROP CONSTRAINT "FK_62f52dc4eed974910ba369b7541"`,
    );
    await queryRunner.query(
      `ALTER TABLE "brs_diffusion_website" DROP CONSTRAINT "FK_a50dcbca0843123f2f1b05e861b"`,
    );
    await queryRunner.query(`DROP TABLE "brs_diffusion_website"`);
  }
}
