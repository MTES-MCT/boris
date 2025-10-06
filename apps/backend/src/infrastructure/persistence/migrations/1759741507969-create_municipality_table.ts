import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMunicipalityTable1759741507969
  implements MigrationInterface
{
  name = 'CreateMunicipalityTable1759741507969';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."municipality_zone_enum" AS ENUM('A', 'Abis', 'B1', 'B2', 'C')`,
    );
    await queryRunner.query(
      `CREATE TABLE "municipality" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "inseeCode" character varying NOT NULL, "zone" "public"."municipality_zone_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "departementId" uuid, CONSTRAINT "PK_281ad341f20df7c41b83a182e2a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "municipality" ADD CONSTRAINT "FK_a6e166d7936bbaf9e0fa8f15388" FOREIGN KEY ("departementId") REFERENCES "departement"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "municipality" DROP CONSTRAINT "FK_a6e166d7936bbaf9e0fa8f15388"`,
    );
    await queryRunner.query(`DROP TABLE "municipality"`);
    await queryRunner.query(`DROP TYPE "public"."municipality_zone_enum"`);
  }
}
