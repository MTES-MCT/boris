import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixBrsFeesNumberType1761554189707 implements MigrationInterface {
  name = 'FixBrsFeesNumberType1761554189707';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "acquisition_simulation" ALTER COLUMN "brsFees" TYPE double precision USING "brsFees"::double precision;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "acquisition_simulation" ALTER COLUMN "brsFees" TYPE integer USING "brsFees"::integer;`,
    );
  }
}
