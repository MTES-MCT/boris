import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBrsDiffusionWebisteLatLngIndex1756386138443
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX brs_diffusion_website_latlng_cube_index ON brs_diffusion_website USING gist (cube(ARRAY[latitude, longitude]));`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX brs_diffusion_website_latlng_cube_index;`,
    );
  }
}
