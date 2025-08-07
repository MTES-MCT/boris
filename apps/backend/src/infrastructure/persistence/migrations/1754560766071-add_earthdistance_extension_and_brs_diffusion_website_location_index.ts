import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEarthdistanceExtensionAndBrsDiffusionWebsiteLocationIndex1754560766071
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS cube;`);
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS earthdistance;`);
    await queryRunner.query(
      `CREATE INDEX brs_diffusion_website_location_index ON brs_diffusion_website USING gist (ll_to_earth(latitude, longitude));`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX brs_diffusion_website_location_index;`);
    await queryRunner.query(`DROP EXTENSION IF EXISTS earthdistance;`);
    await queryRunner.query(`DROP EXTENSION IF EXISTS cube;`);
  }
}
