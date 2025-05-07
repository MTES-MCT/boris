import { MigrationInterface, QueryRunner } from 'typeorm';

export class CompleteManyToManyRelationships1746609892914
  implements MigrationInterface
{
  name = 'CompleteManyToManyRelationships1746609892914';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ofs_departement" DROP CONSTRAINT "FK_2457693ca31a60129662757580b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ofs_region" DROP CONSTRAINT "FK_397995bf5d393e1cb85b908060d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ofs_departement" ADD CONSTRAINT "FK_2457693ca31a60129662757580b" FOREIGN KEY ("departementId") REFERENCES "departement"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ofs_region" ADD CONSTRAINT "FK_397995bf5d393e1cb85b908060d" FOREIGN KEY ("regionId") REFERENCES "region"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ofs_region" DROP CONSTRAINT "FK_397995bf5d393e1cb85b908060d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ofs_departement" DROP CONSTRAINT "FK_2457693ca31a60129662757580b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ofs_region" ADD CONSTRAINT "FK_397995bf5d393e1cb85b908060d" FOREIGN KEY ("regionId") REFERENCES "region"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "ofs_departement" ADD CONSTRAINT "FK_2457693ca31a60129662757580b" FOREIGN KEY ("departementId") REFERENCES "departement"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
