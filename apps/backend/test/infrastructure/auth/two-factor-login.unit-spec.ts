import { APP_FILTER } from '@nestjs/core';
import { AuditService } from 'src/infrastructure/audit/audit.service';
import { AuditExceptionFilter } from 'src/infrastructure/audit/audit-exception.filter';
import { auditContextMiddleware } from 'src/infrastructure/audit/audit-context';
import { Session } from 'express-session';
import {
  Controller,
  Get,
  HttpException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { DataSource } from 'typeorm';
import * as request from 'supertest';
import { UserEntity } from 'src/infrastructure/user/user.entity';
import { UserRole } from 'src/domain/user/user-role.enum';
import { LoginUsecase } from 'src/application/auth/usecases/login.usecase';
import { RequestPasswordResetUsecase } from 'src/application/user/usecases/request-password-reset.usecase';
import { ResetPasswordWithTokenUsecase } from 'src/application/user/usecases/reset-password-with-token.usecase';
import { ChangePasswordUsecase } from 'src/application/user/usecases/change-password.usecase';
import { UserSessionService } from 'src/infrastructure/session/user-session.service';
import { sessionMiddlewares } from 'src/infrastructure/session/session.middleware';
import { configureViewEngine } from 'src/infrastructure/config/view-engine.config';
import { createValidationPipe } from 'src/infrastructure/config/validation-pipe.config';
import { AdminLoginController } from 'src/infrastructure/auth/controllers/login.controller';
import { PortalAuthController } from 'src/infrastructure/auth/controllers/portal-auth.controller';
import { LocalIsAuthenticatedGuard } from 'src/infrastructure/auth/guards/local.isAuthenticated.guard';
import { LocalStrategy } from 'src/infrastructure/auth/strategies/local.strategy';
import { UserSerializer } from 'src/infrastructure/auth/serializers/user.serializer';
import { AuthRateLimitService } from 'src/infrastructure/auth/auth-rate-limit.service';
import { TwoFactorService } from 'src/infrastructure/auth/two-factor.service';
import {
  encryptTotpSecret,
  hashRecoveryCode,
  totpAtStep,
} from 'src/infrastructure/auth/two-factor-crypto';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import flash = require('connect-flash');

@Controller('/')
class ProtectedAdminController {
  @Get()
  @UseGuards(LocalIsAuthenticatedGuard)
  get() {
    return 'admin';
  }
}

describe('two-step login HTTP flows', () => {
  let app: NestExpressApplication;
  let account: UserEntity;
  let limits: Map<string, number>;
  let rejectLoginAudit = false;
  let auditEvents: { eventType: string }[] = [];
  const revokeSessions = jest.fn().mockResolvedValue([]);
  const originalKey = process.env.TWO_FACTOR_ENCRYPTION_KEY;
  const originalNodeEnv = process.env.NODE_ENV;
  const originalDisabled = process.env.TWO_FACTOR_DISABLED;
  const secret = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';
  const recovery = '12345678-abcdefab-12345678-abcdefab';
  const publicUser = () => ({
    id: account.id,
    email: account.email,
    password: account.password,
    roles: account.roles,
    isActive: account.isActive,
    ofss: account.ofss,
    distributor: account.distributor,
    lastLoginAt: account.lastLoginAt,
    twoFactorVersion: account.twoFactorVersion,
  });

  beforeAll(async () => {
    // Use real Passport/session/controller code; only persistence is replaced.
    const repository = {
      update: (_id: string, values: Partial<UserEntity>) => {
        Object.assign(account, values);
        return Promise.resolve();
      },
      createQueryBuilder: () => {
        const query = {
          addSelect: () => query,
          where: () => query,
          setLock: () => query,
          getOne: () => Promise.resolve(account),
        };
        return query;
      },
    };
    const database = {
      getRepository: () => repository,
      transaction: async <T>(
        callback: (manager: {
          getRepository: () => typeof repository;
          query: (sql: string, params: unknown[]) => Promise<unknown>;
          queryRunner: { isTransactionActive: boolean };
          insert: (
            target: unknown,
            event: { eventType: string },
          ) => Promise<void>;
        }) => Promise<T>,
      ) =>
        callback({
          getRepository: () => repository,
          query: (sql: string, params: unknown[]) => {
            if (sql.startsWith('UPDATE "user" SET "twoFactorVersion"'))
              account.twoFactorVersion = (params[1] as string) || null;
            else return Promise.resolve(revokeSessions(sql, params));
            return Promise.resolve();
          },
          queryRunner: { isTransactionActive: true },
          insert: (_target: unknown, event: { eventType: string }) => {
            if (rejectLoginAudit && event.eventType === 'auth.login_succeeded')
              return Promise.reject(new Error('audit unavailable'));
            auditEvents.push(event);
            return Promise.resolve();
          },
        }),
    };
    const module = await Test.createTestingModule({
      imports: [PassportModule.register({ session: true })],
      controllers: [
        AdminLoginController,
        PortalAuthController,
        ProtectedAdminController,
      ],
      providers: [
        AuditService,
        { provide: APP_FILTER, useClass: AuditExceptionFilter },
        LocalStrategy,
        UserSerializer,
        TwoFactorService,
        { provide: DataSource, useValue: database },
        {
          provide: 'UserRepositoryInterface',
          useValue: { findById: () => Promise.resolve(publicUser()) },
        },
        {
          provide: LoginUsecase,
          useValue: {
            execute: ({
              email,
              password,
            }: {
              email: string;
              password: string;
            }) => {
              if (email !== account.email || password !== 'correct-password')
                throw new UnauthorizedException();
              return Promise.resolve(publicUser());
            },
          },
        },
        {
          provide: AuthRateLimitService,
          useValue: {
            consume: (key: string, limit: number) => {
              const count = (limits.get(key) || 0) + 1;
              limits.set(key, count);
              if (count > limit)
                throw new HttpException('Too many requests', 429);
            },
            clear: (key: string) => limits.delete(key),
          },
        },
        ...[
          RequestPasswordResetUsecase,
          ResetPasswordWithTokenUsecase,
          ChangePasswordUsecase,
          UserSessionService,
        ].map((provide) => ({
          provide,
          useValue: {
            destroyAllForUserId: jest.fn().mockResolvedValue(undefined),
          },
        })),
      ],
    }).compile();
    app = module.createNestApplication<NestExpressApplication>();
    app.use(
      auditContextMiddleware,
      ...sessionMiddlewares(database as unknown as DataSource),
      flash(),
    );
    app.useGlobalPipes(createValidationPipe());
    configureViewEngine(app);
    await app.listen(0, '127.0.0.1');
  });

  beforeEach(() => {
    process.env.NODE_ENV = 'test';
    delete process.env.TWO_FACTOR_DISABLED;
    process.env.TWO_FACTOR_ENCRYPTION_KEY = 'ab'.repeat(32);
    limits = new Map();
    rejectLoginAudit = false;
    auditEvents = [];
    revokeSessions.mockClear();
    account = Object.assign(new UserEntity('admin@example.test', 'unused'), {
      id: '11111111-1111-4111-8111-111111111111',
      twoFactorVersion: '22222222-2222-4222-8222-222222222222',
      twoFactorRecoveryCodes: [hashRecoveryCode(recovery)],
      twoFactorLastUsedStep: null,
      ofss: [],
    });
    account.twoFactorSecret = encryptTotpSecret(secret, account.id);
  });

  afterEach(() => {
    if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = originalNodeEnv;
    if (originalDisabled === undefined) delete process.env.TWO_FACTOR_DISABLED;
    else process.env.TWO_FACTOR_DISABLED = originalDisabled;
  });

  afterAll(async () => {
    await app?.close();
    if (originalKey === undefined) delete process.env.TWO_FACTOR_ENCRYPTION_KEY;
    else process.env.TWO_FACTOR_ENCRYPTION_KEY = originalKey;
  });

  const credentials = {
    email: 'admin@example.test',
    password: 'correct-password',
  };
  const otp = () => totpAtStep(secret, Math.floor(Date.now() / 30_000));

  it('records login only after the second factor and leaves no authenticated session if that audit fails', async () => {
    const agent = request.agent(app.getHttpServer());
    await agent.post('/api/portal/auth/login').send(credentials).expect(200);
    expect(
      auditEvents.some((event) => event.eventType === 'auth.login_succeeded'),
    ).toBe(false);
    rejectLoginAudit = true;
    await agent
      .post('/api/portal/auth/two-factor')
      .send({ code: otp() })
      .expect(500);
    rejectLoginAudit = false;
    await agent.get('/api/portal/auth/me').expect(401);
    await agent.get('/').expect(403);
    expect(
      auditEvents.some((event) => event.eventType === 'auth.login_succeeded'),
    ).toBe(false);
  });

  it('keeps the legacy login failure redirect working after audit compensation destroys the session', async () => {
    const agent = request.agent(app.getHttpServer());
    await agent.post('/auth/login').type('form').send(credentials).expect(303);
    rejectLoginAudit = true;
    await agent
      .post('/auth/two-factor')
      .type('form')
      .send({ code: otp() })
      .expect(303)
      .expect('Location', '/auth/login');
    rejectLoginAudit = false;
    await agent.get('/').expect(403);
  });

  it.each(['portal', 'legacy'])(
    'does not authenticate after a transient Passport session save failure (%s)',
    async (flow) => {
      const agent = request.agent(app.getHttpServer());
      if (flow === 'portal')
        await agent
          .post('/api/portal/auth/login')
          .send(credentials)
          .expect(200);
      else
        await agent
          .post('/auth/login')
          .type('form')
          .send(credentials)
          .expect(303);
      // The original method is invoked below with its explicit session receiver.
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const save = Session.prototype.save;
      let failed = false;
      const fault = jest
        .spyOn(Session.prototype, 'save')
        .mockImplementation(function (
          this: Session & { passport?: { user?: string } },
          callback,
        ) {
          if (!failed && this.passport?.user === account.id) {
            failed = true;
            callback?.(new Error('temporary session save failure'));
            return this;
          }
          return save.call(this, callback);
        });
      try {
        if (flow === 'portal')
          await agent
            .post('/api/portal/auth/two-factor')
            .send({ code: otp() })
            .expect(500);
        else
          await agent
            .post('/auth/two-factor')
            .type('form')
            .send({ code: otp() })
            .expect(303)
            .expect('Location', '/auth/login');
        expect(failed).toBe(true);
        await agent.get('/api/portal/auth/me').expect(401);
        await agent.get('/').expect(403);
        expect(
          auditEvents.some(
            (event) => event.eventType === 'auth.login_succeeded',
          ),
        ).toBe(false);
      } finally {
        fault.mockRestore();
      }
    },
  );

  it('does not turn routine auth probes into login failures, but records a rejected login', async () => {
    const agent = request.agent(app.getHttpServer());
    await agent.get('/api/portal/auth/me').expect(401);
    await agent.get('/api/portal/auth/two-factor').expect(401);
    expect(auditEvents).toHaveLength(0);
    await agent
      .post('/api/portal/auth/login')
      .send({ ...credentials, password: 'wrong' })
      .expect(401);
    expect(auditEvents.map((event) => event.eventType)).toEqual([
      'auth.login_failed',
    ]);
  });

  it('records a failed legacy OTP attempt even though the response is a redirect', async () => {
    const agent = request.agent(app.getHttpServer());
    await agent.post('/auth/login').type('form').send(credentials).expect(303);
    await agent
      .post('/auth/two-factor')
      .type('form')
      .send({ code: 'wrong' })
      .expect(303);
    expect(auditEvents.map((event) => event.eventType)).toEqual([
      'auth.login_failed',
    ]);
  });

  it('limits unenrolled admins to portal enrollment while admin login stays blocked', async () => {
    account.twoFactorVersion = null;
    const agent = request.agent(app.getHttpServer());
    const response = await agent
      .post('/api/portal/auth/login')
      .send(credentials)
      .expect(200);
    expect(response.body).toEqual({ enrollmentRequired: true });
    await agent.get('/api/portal/auth/two-factor/enrollment').expect(200);
    await agent.get('/api/portal/auth/me').expect(401);
    await agent
      .post('/auth/login')
      .type('form')
      .send(credentials)
      .expect(303)
      .expect('Location', '/auth/login');
    await agent.get('/api/portal/auth/me').expect(401);
    await agent.get('/').expect(403);
  });

  it.each([UserRole.ADMIN, UserRole.OFS, UserRole.DISTRIBUTOR])(
    'enrolls %s only after proof and returns recovery codes once',
    async (role) => {
      account.roles = [role];
      account.twoFactorVersion = null;
      account.twoFactorSecret = null;
      account.ofss = [{ id: 'ofs' }] as UserEntity['ofss'];
      account.distributor = { id: 'distributor' } as UserEntity['distributor'];
      const agent = request.agent(app.getHttpServer());
      await agent
        .post('/api/portal/auth/login')
        .send(credentials)
        .expect(role === UserRole.ADMIN ? 200 : 204);
      await agent
        .post('/api/portal/auth/two-factor/enrollment')
        .send({ currentPassword: 'wrong' })
        .expect(401);
      const started = await agent
        .post('/api/portal/auth/two-factor/enrollment')
        .send({ currentPassword: credentials.password })
        .expect(200);
      expect(started.body.secret).toMatch(/^[A-Z2-7]{32}$/);
      expect(started.headers['cache-control']).toBe('no-store');
      expect(account.twoFactorVersion).toBeNull();
      expect(
        (await agent.get('/api/portal/auth/two-factor/enrollment').expect(200))
          .body.secret,
      ).toBe(started.body.secret);
      await agent
        .post('/api/portal/auth/two-factor/enrollment/confirm')
        .send({ code: 'wrong' })
        .expect(400);
      expect(account.twoFactorVersion).toBeNull();
      const code = totpAtStep(
        started.body.secret,
        Math.floor(Date.now() / 30_000),
      );
      const completed = await agent
        .post('/api/portal/auth/two-factor/enrollment/confirm')
        .send({ code })
        .expect(200);
      expect(completed.body.recoveryCodes).toHaveLength(10);
      expect(account.twoFactorRecoveryCodes).toEqual(
        completed.body.recoveryCodes.map(hashRecoveryCode),
      );
      await agent.get('/api/portal/auth/me').expect(200);
      const status = await agent
        .get('/api/portal/auth/two-factor/enrollment')
        .expect(200);
      expect(status.body).toMatchObject({
        enabled: true,
        secret: null,
        uri: null,
      });
      expect(status.body.recoveryCodes).toBeUndefined();
      await agent
        .post('/api/portal/auth/two-factor/enrollment/confirm')
        .send({ code })
        .expect(400);
      const other = request.agent(app.getHttpServer());
      await other.post('/api/portal/auth/login').send(credentials).expect(200);
      await other.get('/api/portal/auth/me').expect(401);
      await other
        .post('/api/portal/auth/two-factor')
        .send({ code })
        .expect(400);
      await other
        .post('/api/portal/auth/two-factor')
        .send({ code: completed.body.recoveryCodes[0] })
        .expect(204);
    },
  );

  it('rejects anonymous setup, expires pending secrets and never replaces enabled credentials', async () => {
    const anonymous = request.agent(app.getHttpServer());
    await anonymous.get('/api/portal/auth/two-factor/enrollment').expect(401);
    await anonymous
      .post('/api/portal/auth/two-factor/enrollment/confirm')
      .send({ code: otp() })
      .expect(401);
    account.roles = [UserRole.OFS];
    account.ofss = [{ id: 'ofs' }] as UserEntity['ofss'];
    account.twoFactorVersion = null;
    const agent = request.agent(app.getHttpServer());
    await agent.post('/api/portal/auth/login').send(credentials).expect(204);
    const begin = () =>
      agent
        .post('/api/portal/auth/two-factor/enrollment')
        .send({ currentPassword: credentials.password });
    const first = await begin().expect(200);
    await agent
      .post('/api/portal/auth/two-factor/enrollment/cancel')
      .expect(204);
    expect(
      (await agent.get('/api/portal/auth/two-factor/enrollment')).body.secret,
    ).toBeNull();
    const second = await begin().expect(200);
    expect(second.body.secret).not.toBe(first.body.secret);
    const clock = jest
      .spyOn(Date, 'now')
      .mockReturnValue(Date.now() + 6 * 60_000);
    try {
      await agent
        .post('/api/portal/auth/two-factor/enrollment/confirm')
        .send({
          code: totpAtStep(second.body.secret, Math.floor(Date.now() / 30_000)),
        })
        .expect(400);
      expect(account.twoFactorVersion).toBeNull();
    } finally {
      clock.mockRestore();
    }
    account.twoFactorVersion = 'already-enabled';
    process.env.TWO_FACTOR_DISABLED = 'true';
    await begin().expect(400);
    expect(account.twoFactorVersion).toBe('already-enabled');
  });

  it.each([UserRole.OFS, UserRole.DISTRIBUTOR])(
    'allows %s to disable with a password and a fresh OTP, then requires login again',
    async (role) => {
      account.roles = [role];
      account.ofss = [{ id: 'ofs' }] as UserEntity['ofss'];
      account.distributor = { id: 'distributor' } as UserEntity['distributor'];
      const agent = request.agent(app.getHttpServer());
      await agent.post('/api/portal/auth/login').send(credentials).expect(200);
      await agent
        .post('/api/portal/auth/two-factor')
        .send({ code: recovery })
        .expect(204);
      expect(
        (await agent.get('/api/portal/auth/two-factor/enrollment')).body
          .canDisable,
      ).toBe(true);
      await agent
        .post('/api/portal/auth/two-factor/disable')
        .send({ currentPassword: 'wrong', code: otp() })
        .expect(401);
      await agent
        .post('/api/portal/auth/two-factor/disable')
        .send({
          currentPassword: credentials.password,
          code: '000000' === otp() ? '111111' : '000000',
        })
        .expect(400);
      expect(account.twoFactorVersion).not.toBeNull();
      await agent
        .post('/api/portal/auth/two-factor/disable')
        .send({ currentPassword: credentials.password, code: otp() })
        .expect(204);
      expect(account.twoFactorVersion).toBeNull();
      expect(account.twoFactorSecret).toBeNull();
      expect(revokeSessions).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM "session"'),
        [account.id],
      );
      expect(account.twoFactorRecoveryCodes).toEqual([]);
      await agent.get('/api/portal/auth/me').expect(401);
      await agent.post('/api/portal/auth/login').send(credentials).expect(204);
      await agent.get('/api/portal/auth/me').expect(200);
    },
  );

  it('forbids admin disable requests even during the global bypass', async () => {
    const agent = request.agent(app.getHttpServer());
    await agent.post('/api/portal/auth/login').send(credentials).expect(200);
    await agent
      .post('/api/portal/auth/two-factor')
      .send({ code: recovery })
      .expect(204);
    expect(
      (await agent.get('/api/portal/auth/two-factor/enrollment')).body
        .canDisable,
    ).toBe(false);
    const disable = () =>
      agent
        .post('/api/portal/auth/two-factor/disable')
        .send({ currentPassword: credentials.password, code: otp() });
    await disable().expect(403);
    process.env.TWO_FACTOR_DISABLED = 'true';
    await disable().expect(403);
    expect(account.twoFactorVersion).not.toBeNull();
    const anonymous = request.agent(app.getHttpServer());
    await anonymous
      .post('/api/portal/auth/two-factor/disable')
      .send({ currentPassword: credentials.password, code: otp() })
      .expect(401);
  });

  it('requires the second step before granting portal or admin access and changes the session cookie', async () => {
    const agent = request.agent(app.getHttpServer());
    const started = await agent
      .post('/api/portal/auth/login')
      .send(credentials)
      .expect(200);
    expect(started.body).toEqual({ twoFactorRequired: true });
    await agent.get('/api/portal/auth/me').expect(401);
    await agent.get('/').expect(403);
    expect(account.lastLoginAt).toBeNull();
    await agent.get('/api/portal/auth/two-factor').expect(200);
    const completed = await agent
      .post('/api/portal/auth/two-factor')
      .send({ code: otp() })
      .expect(204);
    expect(completed.headers['set-cookie']).not.toEqual(
      started.headers['set-cookie'],
    );
    await agent.get('/api/portal/auth/me').expect(200);
    await agent.get('/').expect(200);
    expect(account.lastLoginAt).toBeInstanceOf(Date);
    await agent
      .post('/api/portal/auth/two-factor')
      .send({ code: recovery })
      .expect(401);
  });

  it('renders the admin verification screen and completes its login', async () => {
    const agent = request.agent(app.getHttpServer());
    await agent
      .post('/auth/login')
      .type('form')
      .send(credentials)
      .expect(303)
      .expect('Location', '/auth/two-factor');
    const screen = await agent.get('/auth/two-factor').expect(200);
    expect(screen.text).toContain('autocomplete="one-time-code"');
    expect(screen.headers['cache-control']).toBe('no-store');
    await agent
      .post('/auth/two-factor')
      .type('form')
      .send({ code: otp() })
      .expect(303)
      .expect('Location', '/');
    await agent.get('/').expect(200);
  });

  it('rejects wrong passwords, missing challenges, invalid codes and reused TOTPs', async () => {
    const agent = request.agent(app.getHttpServer());
    await agent
      .post('/api/portal/auth/login')
      .send({ ...credentials, password: 'wrong' })
      .expect(401);
    await agent
      .post('/api/portal/auth/two-factor')
      .send({ code: otp() })
      .expect(401);
    await agent.post('/api/portal/auth/login').send(credentials).expect(200);
    await agent
      .post('/api/portal/auth/two-factor')
      .send({ code: 'invalid' })
      .expect(400);
    await agent
      .post('/api/portal/auth/two-factor')
      .send({ code: otp() })
      .expect(204);
    const other = request.agent(app.getHttpServer());
    await other.post('/api/portal/auth/login').send(credentials).expect(200);
    await other
      .post('/api/portal/auth/two-factor')
      .send({ code: otp() })
      .expect(400);
    await other.get('/api/portal/auth/me').expect(401);
  });

  it('consumes a recovery code once and invalidates sessions after a credential reset', async () => {
    const agent = request.agent(app.getHttpServer());
    await agent.post('/api/portal/auth/login').send(credentials).expect(200);
    await agent
      .post('/api/portal/auth/two-factor')
      .send({ code: recovery.toUpperCase() })
      .expect(204);
    expect(account.twoFactorRecoveryCodes).toEqual([]);
    await agent.get('/api/portal/auth/me').expect(200);
    account.twoFactorVersion = '33333333-3333-4333-8333-333333333333';
    await agent.get('/api/portal/auth/me').expect(401);
    await agent.get('/').expect(403);
    const other = request.agent(app.getHttpServer());
    await other.post('/api/portal/auth/login').send(credentials).expect(200);
    await other
      .post('/api/portal/auth/two-factor')
      .send({ code: recovery })
      .expect(400);
  });

  it('expires pending logins and rejects challenges after secret replacement or account deactivation', async () => {
    const agent = request.agent(app.getHttpServer());
    await agent.post('/api/portal/auth/login').send(credentials).expect(200);
    const current = Date.now();
    const clock = jest.spyOn(Date, 'now').mockReturnValue(current + 6 * 60_000);
    await agent
      .post('/api/portal/auth/two-factor')
      .send({ code: otp() })
      .expect(401);
    clock.mockRestore();
    await agent.post('/api/portal/auth/login').send(credentials).expect(200);
    account.twoFactorVersion = 'changed';
    await agent
      .post('/api/portal/auth/two-factor')
      .send({ code: otp() })
      .expect(400);
    await agent.post('/api/portal/auth/login').send(credentials).expect(200);
    account.isActive = false;
    await agent
      .post('/api/portal/auth/two-factor')
      .send({ code: otp() })
      .expect(400);
  });

  it('limits verification across new pending logins for the same account', async () => {
    const agent = request.agent(app.getHttpServer());
    await agent.post('/api/portal/auth/login').send(credentials).expect(200);
    for (let i = 0; i < 5; i++) {
      await agent
        .post('/api/portal/auth/two-factor')
        .send({ code: 'invalid' })
        .expect(400);
    }
    await agent.post('/api/portal/auth/login').send(credentials).expect(200);
    await agent
      .post('/api/portal/auth/two-factor')
      .send({ code: otp() })
      .expect(429);
    await agent.get('/api/portal/auth/me').expect(401);
  });

  it('keeps OFS password login working without enabling 2FA', async () => {
    account.roles = [UserRole.OFS];
    account.twoFactorVersion = null;
    account.ofss = [{ id: 'ofs' }] as UserEntity['ofss'];
    const agent = request.agent(app.getHttpServer());
    await agent.post('/api/portal/auth/login').send(credentials).expect(204);
    await agent.get('/api/portal/auth/me').expect(200);
    await agent.get('/').expect(403);
  });

  it('bypasses both admin login flows in production until explicitly re-enabled', async () => {
    process.env.NODE_ENV = 'production';
    process.env.TWO_FACTOR_DISABLED = 'true';
    account.twoFactorVersion = null;
    const portal = request.agent(app.getHttpServer());
    await portal.post('/api/portal/auth/login').send(credentials).expect(204);
    await portal.get('/api/portal/auth/me').expect(200);
    const admin = request.agent(app.getHttpServer());
    await admin
      .post('/auth/login')
      .type('form')
      .send(credentials)
      .expect(303)
      .expect('Location', '/');
    await admin.get('/').expect(200);
    process.env.TWO_FACTOR_DISABLED = 'false';
    await portal.get('/api/portal/auth/me').expect(401);
    await admin.get('/').expect(403);
  });
});
