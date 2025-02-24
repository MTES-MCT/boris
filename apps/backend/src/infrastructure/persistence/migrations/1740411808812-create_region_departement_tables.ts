import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRegionDepartementTables1740411808812
  implements MigrationInterface
{
  name = 'CreateRegionDepartementTables1740411808812';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "departement" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "zipcode" integer NOT NULL, "regionId" uuid, CONSTRAINT "PK_f32f7be16ef46566fececc35a34" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "region" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_5f48ffc3af96bc486f5f3f3a6da" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "departement" ADD CONSTRAINT "FK_776170f7add6a44f6d22348b5f7" FOREIGN KEY ("regionId") REFERENCES "region"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "departement" DROP CONSTRAINT "FK_776170f7add6a44f6d22348b5f7"`,
    );
    await queryRunner.query(`DROP TABLE "region"`);
    await queryRunner.query(`DROP TABLE "departement"`);
  }
}
