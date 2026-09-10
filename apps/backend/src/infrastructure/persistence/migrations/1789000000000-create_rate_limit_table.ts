import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRateLimitTable1789000000000 implements MigrationInterface {
  name = 'CreateRateLimitTable1789000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rate_limit" (
        "key" character varying(64) NOT NULL,
        "count" integer NOT NULL,
        "resetAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        CONSTRAINT "PK_rate_limit_key" PRIMARY KEY ("key")
      )`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_rate_limit_reset_at" ON "rate_limit" ("resetAt")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_rate_limit_reset_at"`);
    await queryRunner.query(`DROP TABLE "rate_limit"`);
  }
}
