import { randomUUID } from 'crypto';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { Request } from 'express';
import { DataSource } from 'typeorm';
import { typeormConfig } from 'src/infrastructure/persistence/typeorm.config';
import { AddUserTwoFactor1794500000000 } from 'src/infrastructure/persistence/migrations/1794500000000-add_user_two_factor';
import { UserEntity } from 'src/infrastructure/user/user.entity';
import { UserRepository } from 'src/infrastructure/user/user.repository';
import { UserSessionService } from 'src/infrastructure/session/user-session.service';
import { SessionEntity } from 'src/infrastructure/session/session.entity';
import { AuthRateLimitService } from 'src/infrastructure/auth/auth-rate-limit.service';
import { TwoFactorService } from 'src/infrastructure/auth/two-factor.service';
import {
  encryptTotpSecret,
  hashRecoveryCode,
  totpAtStep,
} from 'src/infrastructure/auth/two-factor-crypto';

// Explicit opt-in database; never migrate or reset the application's configured DB.
const databaseUrl = process.env.TWO_FACTOR_TEST_DATABASE_URL;
const describeDatabase = databaseUrl ? describe : describe.skip;

describeDatabase('2FA PostgreSQL persistence', () => {
  let db: DataSource;
  let user: UserEntity;
  let users: UserRepository;
  let service: TwoFactorService;
  const schema = `two_factor_test_${randomUUID().replace(/-/g, '')}`;
  const secret = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';
  const recovery = '12345678-abcdefab-12345678-abcdefab';
  const originalKey = process.env.TWO_FACTOR_ENCRYPTION_KEY;

  beforeAll(async () => {
    const url = new URL(databaseUrl!);
    db = new DataSource({
      entities: typeormConfig.entities,
      type: 'postgres',
      url: undefined,
      host: url.hostname,
      port: Number(url.port || 5432),
      username: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname.slice(1),
      schema,
      extra: { options: `-c search_path=${schema},public` },
      migrations: [],
    });
    await db.initialize();
    await db.query(`CREATE SCHEMA "${schema}"`);
    await db.synchronize();
    await db.query(
      `CREATE TABLE rate_limit (key text PRIMARY KEY, count integer NOT NULL, "resetAt" timestamp NOT NULL)`,
    );
    users = new UserRepository(db.getRepository(UserEntity));
    service = new TwoFactorService(db, new AuthRateLimitService(db), users);
  }, 30_000);

  beforeEach(async () => {
    process.env.TWO_FACTOR_ENCRYPTION_KEY = 'ab'.repeat(32);
    user = await users.save(
      new UserEntity(`${randomUUID()}@example.test`, 'unused'),
    );
    await db.query(
      `UPDATE "user" SET "twoFactorVersion" = $2,
      "twoFactorSecret" = $3, "twoFactorRecoveryCodes" = $4::jsonb WHERE id = $1`,
      [
        user.id,
        randomUUID(),
        encryptTotpSecret(secret, user.id),
        JSON.stringify([hashRecoveryCode(recovery)]),
      ],
    );
    user = (await users.findById(user.id))!;
  });

  afterAll(async () => {
    if (db?.isInitialized) {
      await db.query(`DROP SCHEMA "${schema}" CASCADE`);
      await db.destroy();
    }
    if (originalKey === undefined) delete process.env.TWO_FACTOR_ENCRYPTION_KEY;
    else process.env.TWO_FACTOR_ENCRYPTION_KEY = originalKey;
  });

  it('reverses and applies the migration without removing existing users', async () => {
    const runner = db.createQueryRunner();
    try {
      await new AddUserTwoFactor1794500000000().down(runner);
      await new AddUserTwoFactor1794500000000().up(runner);
      expect((await users.findById(user.id))?.twoFactorVersion).toBeNull();
      const columns = await db.query(
        `SELECT "twoFactorRecoveryCodes" FROM "user" WHERE id = $1`,
        [user.id],
      );
      expect(columns[0].twoFactorRecoveryCodes).toEqual([]);
    } finally {
      await runner.release();
    }
  });

  it('does not select secrets or restore a stale credential version through ordinary saves', async () => {
    expect(user.twoFactorSecret).toBeUndefined();
    expect(user.twoFactorRecoveryCodes).toBeUndefined();
    const version = randomUUID();
    await db.query(`UPDATE "user" SET "twoFactorVersion" = $2 WHERE id = $1`, [
      user.id,
      version,
    ]);
    user.password = 'changed-password';
    await users.save(user);
    expect((await users.findById(user.id))?.twoFactorVersion).toBe(version);
  });

  const pendingRequest = () => {
    const session = {
      pendingTwoFactor: {
        userId: user.id,
        version: user.twoFactorVersion,
        expiresAt: Date.now() + 60_000,
      },
      regenerate: (callback: () => void) => callback(),
      save: (callback: () => void) => callback(),
    };
    return {
      session,
      ip: '127.0.0.1',
      logIn: (_user: UserEntity, callback: () => void) => callback(),
    } as unknown as Request;
  };

  it.each(['totp', 'recovery'])(
    'allows only one concurrent use of a %s code',
    async (kind) => {
      const code =
        kind === 'totp'
          ? totpAtStep(secret, Math.floor(Date.now() / 30_000))
          : recovery;
      const results = await Promise.allSettled([
        service.verify(pendingRequest(), code),
        service.verify(pendingRequest(), code),
      ]);
      expect(
        results.filter((result) => result.status === 'fulfilled'),
      ).toHaveLength(1);
      expect(
        results.filter((result) => result.status === 'rejected'),
      ).toHaveLength(1);
    },
  );

  it('revokes pending and authenticated sessions while keeping other accounts intact', async () => {
    const sessions = db.getRepository(SessionEntity);
    await sessions.save([
      {
        id: 'pending',
        expiredAt: Date.now() + 60_000,
        json: JSON.stringify({ pendingTwoFactor: { userId: user.id } }),
      },
      {
        id: 'authenticated',
        expiredAt: Date.now() + 60_000,
        json: JSON.stringify({ passport: { user: user.id } }),
      },
      {
        id: 'unrelated',
        expiredAt: Date.now() + 60_000,
        json: JSON.stringify({ passport: { user: 'someone-else' } }),
      },
    ]);
    await new UserSessionService(sessions).destroyAllForUserId(user.id);
    expect((await sessions.find()).map((session) => session.id)).toEqual([
      'unrelated',
    ]);
  });

  it('provisions and resets through the CLI, replacing credentials and revoking sessions', async () => {
    const admin = await users.save(
      new UserEntity(`${randomUUID()}@example.test`, 'unused'),
    );
    const url = new URL(databaseUrl!);
    const provision = (...flags: string[]) =>
      promisify(execFile)(
        'npm',
        ['run', 'two-factor:provision', '--', admin.email, ...flags],
        {
          env: {
            ...process.env,
            NODE_ENV: 'development',
            POSTGRES_URL: '',
            POSTGRES_HOST: url.hostname,
            POSTGRES_PORT: url.port,
            POSTGRES_USER: decodeURIComponent(url.username),
            POSTGRES_PASSWORD: decodeURIComponent(url.password),
            POSTGRES_DB: url.pathname.slice(1),
            PGOPTIONS: `-c search_path=${schema},public`,
          },
        },
      );
    const { stdout } = await provision();
    const setupKey = stdout.match(/Setup key: ([A-Z2-7]{32})/)?.[1];
    expect(setupKey).toBeDefined();
    expect(stdout.match(/^[a-f0-9]{8}(-[a-f0-9]{8}){3}$/gm)).toHaveLength(10);
    const original = (await users.findById(admin.id))!;
    expect(original.twoFactorVersion).toBeTruthy();
    await expect(provision()).rejects.toThrow();
    await db.getRepository(SessionEntity).save({
      id: 'cli-pending',
      expiredAt: Date.now() + 60_000,
      json: JSON.stringify({ pendingTwoFactor: { userId: admin.id } }),
    });
    const reset = await provision('--reset');
    expect(reset.stdout).not.toContain(`Setup key: ${setupKey}`);
    expect((await users.findById(admin.id))?.twoFactorVersion).not.toBe(
      original.twoFactorVersion,
    );
    expect(
      await db.getRepository(SessionEntity).findOneBy({ id: 'cli-pending' }),
    ).toBeNull();
  }, 30_000);
});
