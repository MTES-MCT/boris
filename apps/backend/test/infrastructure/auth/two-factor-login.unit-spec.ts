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
  const originalKey = process.env.TWO_FACTOR_ENCRYPTION_KEY;
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
        }) => Promise<T>,
      ) => callback({ getRepository: () => repository }),
    };
    const module = await Test.createTestingModule({
      imports: [PassportModule.register({ session: true })],
      controllers: [
        AdminLoginController,
        PortalAuthController,
        ProtectedAdminController,
      ],
      providers: [
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
        ].map((provide) => ({ provide, useValue: {} })),
      ],
    }).compile();
    app = module.createNestApplication<NestExpressApplication>();
    app.use(...sessionMiddlewares(database as unknown as DataSource), flash());
    app.useGlobalPipes(createValidationPipe());
    configureViewEngine(app);
    await app.listen(0, '127.0.0.1');
  });

  beforeEach(() => {
    process.env.TWO_FACTOR_ENCRYPTION_KEY = 'ab'.repeat(32);
    limits = new Map();
    account = Object.assign(new UserEntity('admin@example.test', 'unused'), {
      id: '11111111-1111-4111-8111-111111111111',
      twoFactorVersion: '22222222-2222-4222-8222-222222222222',
      twoFactorRecoveryCodes: [hashRecoveryCode(recovery)],
      twoFactorLastUsedStep: null,
      ofss: [],
    });
    account.twoFactorSecret = encryptTotpSecret(secret, account.id);
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

  it('blocks admins without a provisioned secret on both entry points', async () => {
    account.twoFactorVersion = null;
    const agent = request.agent(app.getHttpServer());
    await agent.post('/api/portal/auth/login').send(credentials).expect(403);
    await agent
      .post('/auth/login')
      .type('form')
      .send(credentials)
      .expect(303)
      .expect('Location', '/auth/login');
    await agent.get('/api/portal/auth/me').expect(401);
    await agent.get('/').expect(403);
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
});
