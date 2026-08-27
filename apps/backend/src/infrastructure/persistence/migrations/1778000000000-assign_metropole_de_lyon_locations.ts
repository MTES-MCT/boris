import { MigrationInterface, QueryRunner } from 'typeorm';

const METROPOLE_DE_LYON_INSEE_CODES = [
  '69003',
  '69029',
  '69033',
  '69034',
  '69040',
  '69044',
  '69046',
  '69063',
  '69068',
  '69069',
  '69071',
  '69072',
  '69081',
  '69085',
  '69087',
  '69088',
  '69089',
  '69091',
  '69096',
  '69100',
  '69116',
  '69117',
  '69123',
  '69127',
  '69142',
  '69143',
  '69149',
  '69152',
  '69153',
  '69163',
  '69168',
  '69191',
  '69194',
  '69199',
  '69202',
  '69204',
  '69205',
  '69207',
  '69233',
  '69244',
  '69250',
  '69256',
  '69259',
  '69260',
  '69266',
  '69271',
  '69273',
  '69275',
  '69276',
  '69278',
  '69279',
  '69282',
  '69283',
  '69284',
  '69286',
  '69290',
  '69292',
  '69293',
  '69296',
  '69381',
  '69382',
  '69383',
  '69384',
  '69385',
  '69386',
  '69387',
  '69388',
  '69389',
];

export class AssignMetropoleDeLyonLocations1778000000000
  implements MigrationInterface
{
  name = 'AssignMetropoleDeLyonLocations1778000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.assignDepartement(queryRunner, '69M');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await this.assignDepartement(queryRunner, '69');
  }

  private async assignDepartement(
    queryRunner: QueryRunner,
    departementCode: string,
  ): Promise<void> {
    const placeholders = METROPOLE_DE_LYON_INSEE_CODES.map(
      (_, index) => `$${index + 2}`,
    ).join(', ');
    const parameters = [departementCode, ...METROPOLE_DE_LYON_INSEE_CODES];

    await queryRunner.query(
      `UPDATE "location"
       SET "departementId" = (
         SELECT "id" FROM "departement" WHERE "code" = $1 LIMIT 1
       )
       WHERE "citycode" IN (${placeholders})
       AND EXISTS (SELECT 1 FROM "departement" WHERE "code" = $1)`,
      parameters,
    );

    await queryRunner.query(
      `UPDATE "municipality"
       SET "departementId" = (
         SELECT "id" FROM "departement" WHERE "code" = $1 LIMIT 1
       )
       WHERE "inseeCode" IN (${placeholders})
       AND EXISTS (SELECT 1 FROM "departement" WHERE "code" = $1)`,
      parameters,
    );
  }
}
