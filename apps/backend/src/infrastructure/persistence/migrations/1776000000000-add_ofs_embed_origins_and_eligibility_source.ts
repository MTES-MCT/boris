import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOfsEmbedOriginsAndEligibilitySource1776000000000
  implements MigrationInterface
{
  name = 'AddOfsEmbedOriginsAndEligibilitySource1776000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."eligibility_simulation_sourcetype_enum" AS ENUM('BORIS_PUBLIC', 'OFS_EMBED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "eligibility_simulation" ADD "sourceType" "public"."eligibility_simulation_sourcetype_enum" NOT NULL DEFAULT 'BORIS_PUBLIC'`,
    );
    await queryRunner.query(
      `ALTER TABLE "eligibility_simulation" ADD "sourceOfsId" uuid`,
    );
    await queryRunner.query(
      `CREATE TABLE "ofs_embed_origin" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ofsId" uuid NOT NULL, "origin" character varying NOT NULL, "enabled" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ofs_embed_origin_origin" UNIQUE ("origin"), CONSTRAINT "PK_ofs_embed_origin" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ofs_embed_origin_ofs" ON "ofs_embed_origin" ("ofsId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "eligibility_simulation" ADD CONSTRAINT "FK_eligibility_simulation_source_ofs" FOREIGN KEY ("sourceOfsId") REFERENCES "ofs"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ofs_embed_origin" ADD CONSTRAINT "FK_ofs_embed_origin_ofs" FOREIGN KEY ("ofsId") REFERENCES "ofs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ofs_embed_origin" DROP CONSTRAINT "FK_ofs_embed_origin_ofs"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eligibility_simulation" DROP CONSTRAINT "FK_eligibility_simulation_source_ofs"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_ofs_embed_origin_ofs"`);
    await queryRunner.query(`DROP TABLE "ofs_embed_origin"`);
    await queryRunner.query(
      `ALTER TABLE "eligibility_simulation" DROP COLUMN "sourceOfsId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eligibility_simulation" DROP COLUMN "sourceType"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."eligibility_simulation_sourcetype_enum"`,
    );
  }
}
