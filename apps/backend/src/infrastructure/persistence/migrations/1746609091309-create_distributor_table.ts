import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDistributorTable1746609091309 implements MigrationInterface {
  name = 'CreateDistributorTable1746609091309';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "distributor" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "websiteUrl" character varying NOT NULL, CONSTRAINT "PK_949c7e62bf60d4e6488f6f29b8d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "ofs_distributor" ("ofsId" uuid NOT NULL, "distributorId" uuid NOT NULL, CONSTRAINT "PK_2d2cb6d9c4f8bd733910bd4a779" PRIMARY KEY ("ofsId", "distributorId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0a00bec739bf153c85214fffb9" ON "ofs_distributor" ("ofsId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b28fbce6232f17861b1050ae5a" ON "ofs_distributor" ("distributorId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "ofs_distributor" ADD CONSTRAINT "FK_0a00bec739bf153c85214fffb9f" FOREIGN KEY ("ofsId") REFERENCES "ofs"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "ofs_distributor" ADD CONSTRAINT "FK_b28fbce6232f17861b1050ae5ad" FOREIGN KEY ("distributorId") REFERENCES "distributor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ofs_distributor" DROP CONSTRAINT "FK_b28fbce6232f17861b1050ae5ad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ofs_distributor" DROP CONSTRAINT "FK_0a00bec739bf153c85214fffb9f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b28fbce6232f17861b1050ae5a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0a00bec739bf153c85214fffb9"`,
    );
    await queryRunner.query(`DROP TABLE "ofs_distributor"`);
    await queryRunner.query(`DROP TABLE "distributor"`);
  }
}
