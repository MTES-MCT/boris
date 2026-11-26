import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserApiKey1795700000000 implements MigrationInterface {
  async up(runner: QueryRunner): Promise<void> {
    await runner.query(`CREATE TABLE user_api_key (
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      "userId" uuid NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
      name varchar(100) NOT NULL,
      prefix varchar(24) NOT NULL,
      "tokenHash" varchar(64) NOT NULL UNIQUE,
      "createdAt" timestamptz NOT NULL DEFAULT now(),
      "lastUsedAt" timestamptz
    )`);
    await runner.query('CREATE INDEX ON user_api_key ("userId")');
  }

  async down(runner: QueryRunner): Promise<void> {
    await runner.query('DROP TABLE user_api_key');
  }
}
