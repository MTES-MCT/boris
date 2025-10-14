import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStartedProgramsColumnToOfs1760433948656
  implements MigrationInterface
{
  name = 'AddStartedProgramsColumnToOfs1760433948656';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ofs" ADD "hasStartedPrograms" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ofs" DROP COLUMN "hasStartedPrograms"`,
    );
  }
}
