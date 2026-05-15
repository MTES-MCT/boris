import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserRolesOfsLinksAndPasswordResetTokens1774000000000
  implements MigrationInterface
{
  name = 'AddUserRolesOfsLinksAndPasswordResetTokens1774000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_roles_enum" AS ENUM('admin', 'ofs')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "roles" "public"."user_roles_enum" array NOT NULL DEFAULT ARRAY['admin']::"public"."user_roles_enum"[]`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isActive" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_ofs" ("userId" uuid NOT NULL, "ofsId" uuid NOT NULL, CONSTRAINT "PK_d3f57fb4ac9608b62033538e7d8" PRIMARY KEY ("userId", "ofsId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_user_ofs_user" ON "user_ofs" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_user_ofs_ofs" ON "user_ofs" ("ofsId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user_password_reset_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tokenHash" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, CONSTRAINT "UQ_6069eb0bdba8aebdfb8ba0cb4c1" UNIQUE ("tokenHash"), CONSTRAINT "UQ_76b72caa13a4f7d34a7e3cb87ca" UNIQUE ("userId"), CONSTRAINT "PK_b5f2904162d036e4b541e887c41" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_ofs" ADD CONSTRAINT "FK_2ff5d54f3e857d00c60456f4b6f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_ofs" ADD CONSTRAINT "FK_1b0d5e3f5afcaa4eecbd9b44824" FOREIGN KEY ("ofsId") REFERENCES "ofs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_password_reset_token" ADD CONSTRAINT "FK_76b72caa13a4f7d34a7e3cb87ca" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_password_reset_token" DROP CONSTRAINT "FK_76b72caa13a4f7d34a7e3cb87ca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_ofs" DROP CONSTRAINT "FK_1b0d5e3f5afcaa4eecbd9b44824"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_ofs" DROP CONSTRAINT "FK_2ff5d54f3e857d00c60456f4b6f"`,
    );
    await queryRunner.query(`DROP TABLE "user_password_reset_token"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_user_ofs_ofs"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_user_ofs_user"`);
    await queryRunner.query(`DROP TABLE "user_ofs"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isActive"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "roles"`);
    await queryRunner.query(`DROP TYPE "public"."user_roles_enum"`);
  }
}
