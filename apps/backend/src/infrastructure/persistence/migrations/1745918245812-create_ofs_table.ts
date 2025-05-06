import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOfsTable1745918245812 implements MigrationInterface {
  name = 'CreateOfsTable1745918245812';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "ofs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "phone" character varying NOT NULL, "websiteUrl" character varying NOT NULL, CONSTRAINT "PK_3a8315363ae9c24cfdd2d6c271f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "ofs_departement" ("ofsId" uuid NOT NULL, "departementId" uuid NOT NULL, CONSTRAINT "PK_b05429ff8f65c8198b42bb60cf5" PRIMARY KEY ("ofsId", "departementId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_700602826f82b6c99dc7c0983c" ON "ofs_departement" ("ofsId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2457693ca31a60129662757580" ON "ofs_departement" ("departementId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "ofs_region" ("ofsId" uuid NOT NULL, "regionId" uuid NOT NULL, CONSTRAINT "PK_a646d3a88fab887cce6281a5607" PRIMARY KEY ("ofsId", "regionId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_224b0edf255c9b5d182a8707d4" ON "ofs_region" ("ofsId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_397995bf5d393e1cb85b908060" ON "ofs_region" ("regionId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "ofs_departement" ADD CONSTRAINT "FK_700602826f82b6c99dc7c0983ce" FOREIGN KEY ("ofsId") REFERENCES "ofs"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "ofs_departement" ADD CONSTRAINT "FK_2457693ca31a60129662757580b" FOREIGN KEY ("departementId") REFERENCES "departement"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "ofs_region" ADD CONSTRAINT "FK_224b0edf255c9b5d182a8707d4d" FOREIGN KEY ("ofsId") REFERENCES "ofs"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "ofs_region" ADD CONSTRAINT "FK_397995bf5d393e1cb85b908060d" FOREIGN KEY ("regionId") REFERENCES "region"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ofs_region" DROP CONSTRAINT "FK_397995bf5d393e1cb85b908060d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ofs_region" DROP CONSTRAINT "FK_224b0edf255c9b5d182a8707d4d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ofs_departement" DROP CONSTRAINT "FK_2457693ca31a60129662757580b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ofs_departement" DROP CONSTRAINT "FK_700602826f82b6c99dc7c0983ce"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_397995bf5d393e1cb85b908060"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_224b0edf255c9b5d182a8707d4"`,
    );
    await queryRunner.query(`DROP TABLE "ofs_region"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2457693ca31a60129662757580"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_700602826f82b6c99dc7c0983c"`,
    );
    await queryRunner.query(`DROP TABLE "ofs_departement"`);
    await queryRunner.query(`DROP TABLE "ofs"`);
  }
}
