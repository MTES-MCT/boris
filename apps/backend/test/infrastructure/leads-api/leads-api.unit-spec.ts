import {
  Controller,
  Get,
  HttpException,
  INestApplication,
  UseGuards,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { randomUUID } from 'node:crypto';
import { Request, Response, NextFunction } from 'express';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { Repository } from 'typeorm';
import { ApiKeysController } from 'src/infrastructure/leads-api/api-keys.controller';
import { ApiKeysService } from 'src/infrastructure/leads-api/api-keys.service';
import { LeadsController } from 'src/infrastructure/leads-api/leads.controller';
import { LeadsApiKeyGuard } from 'src/infrastructure/leads-api/leads-api-key.guard';
import { UserApiKeyEntity } from 'src/infrastructure/leads-api/user-api-key.entity';
import { UserEntity } from 'src/infrastructure/user/user.entity';
import { UserRole } from 'src/domain/user/user-role.enum';
import { OfsEntity } from 'src/infrastructure/ofs/ofs.entity';
import { EligibilitySimulationRepository } from 'src/infrastructure/eligibility-simulation/eligibility-simulation.repository';
import { ApiKeyGuard } from 'src/infrastructure/auth/guards/api-key.guard';
import { AuthRateLimitService } from 'src/infrastructure/auth/auth-rate-limit.service';
import {
  AuditService,
  recordAudit,
} from 'src/infrastructure/audit/audit.service';
import { createValidationPipe } from 'src/infrastructure/config/validation-pipe.config';

jest.mock('src/infrastructure/audit/audit.service', () => ({
  ...jest.requireActual('src/infrastructure/audit/audit.service'),
  recordAudit: jest.fn(),
}));

@Controller('/internal')
class InternalController {
  @Get()
  @UseGuards(ApiKeyGuard)
  list() {
    return { internal: true };
  }
}

describe('User API keys and leads HTTP boundary', () => {
  let app: INestApplication<App>;
  let owner: UserEntity;
  let stored: UserApiKeyEntity[];
  const ofsId = randomUUID();
  const secondUser = randomUUID();
  const contacts = { findApiContactLines: jest.fn() };
  const ofss = { findOne: jest.fn() };
  const audit = { record: jest.fn(), attempt: jest.fn() };
  const rateLimit = { consume: jest.fn() };
  let repo: Partial<Repository<UserApiKeyEntity>>;

  beforeAll(async () => {
    repo = {
      find: ({ where }: { where: { userId: string } }) =>
        Promise.resolve(stored.filter((key) => key.userId === where.userId)),
      findOne: ({ where }: { where: { tokenHash: string } }) => {
        const key = stored.find((key) => key.tokenHash === where.tokenHash);
        return Promise.resolve(key ? { ...key, user: owner } : null);
      },
      delete: ({ id, userId }: { id: string; userId: string }) => {
        const index = stored.findIndex(
          (key) => key.id === id && key.userId === userId,
        );
        if (index < 0) return Promise.resolve({ affected: 0 });
        stored.splice(index, 1);
        return Promise.resolve({ affected: 1 });
      },
      update: ({ id }: { id: string }, values: { lastUsedAt: Date }) => {
        const key = stored.find((key) => key.id === id);
        if (!key) return Promise.resolve({ affected: 0 });
        Object.assign(key, values);
        return Promise.resolve({ affected: 1 });
      },
      manager: {
        transaction: async (work: (manager: unknown) => Promise<unknown>) =>
          work({
            create: (_entity: unknown, values: object) => values,
            save: (_entity: unknown, values: object) => {
              const key = {
                id: randomUUID(),
                createdAt: new Date(),
                ...values,
              } as UserApiKeyEntity;
              stored.push(key);
              return Promise.resolve(key);
            },
          }),
      },
    } as unknown as Repository<UserApiKeyEntity>;
    const module = await Test.createTestingModule({
      controllers: [ApiKeysController, LeadsController, InternalController],
      providers: [
        ApiKeysService,
        LeadsApiKeyGuard,
        ApiKeyGuard,
        { provide: getRepositoryToken(UserApiKeyEntity), useValue: repo },
        { provide: getRepositoryToken(OfsEntity), useValue: ofss },
        { provide: EligibilitySimulationRepository, useValue: contacts },
        { provide: AuditService, useValue: audit },
        { provide: AuthRateLimitService, useValue: rateLimit },
      ],
    }).compile();
    app = module.createNestApplication();
    app.use((req: Request, _res: Response, next: NextFunction) => {
      const userId = req.headers['x-test-user'];
      req.isAuthenticated = (() =>
        Boolean(userId)) as Request['isAuthenticated'];
      if (userId) req.user = { ...owner, id: userId };
      next();
    });
    app.useGlobalPipes(createValidationPipe());
    await app.init();
  });
  beforeEach(() => {
    owner = {
      id: randomUUID(),
      isActive: true,
      roles: [UserRole.OFS],
      ofss: [{ id: ofsId }],
    } as UserEntity;
    stored = [];
  });
  afterAll(async () => {
    await app.close();
  });

  async function create() {
    const result = await request(app.getHttpServer())
      .post('/api/portal/api-keys')
      .set('x-test-user', owner.id)
      .send({ name: ' CRM ' })
      .expect(201);
    return result.body as { id: string; token: string; name: string };
  }

  it('reveals a random token only at creation, stores its hash, and restricts listing and deletion to its owner', async () => {
    const created = await create();
    expect(created.name).toBe('CRM');
    expect(created.token).toMatch(/^boris_live_[a-f0-9]{64}$/);
    expect(stored[0].tokenHash).not.toContain(created.token);
    expect(stored[0].tokenHash).toHaveLength(64);
    expect(recordAudit).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ type: 'api_key.created' }),
    );
    const listed = await request(app.getHttpServer())
      .get('/api/portal/api-keys')
      .set('x-test-user', owner.id)
      .expect(200);
    expect(listed.body[0]).not.toHaveProperty('token');
    expect(listed.body[0]).not.toHaveProperty('tokenHash');
    expect(listed.body[0].lastUsedAt).toBeNull();
    const others = await request(app.getHttpServer())
      .get('/api/portal/api-keys')
      .set('x-test-user', secondUser)
      .expect(200);
    expect(others.body).toEqual([]);
    await request(app.getHttpServer())
      .delete(`/api/portal/api-keys/${created.id}`)
      .set('x-test-user', secondUser)
      .expect(404);
    await request(app.getHttpServer())
      .delete(`/api/portal/api-keys/${created.id}`)
      .set('x-test-user', owner.id)
      .expect(204);
    await request(app.getHttpServer())
      .get(`/api/v1/leads?ofsId=${ofsId}`)
      .auth(created.token, { type: 'bearer' })
      .expect(401);
  });

  it('applies current OFS memberships, validates pagination, audits access and records successful usage', async () => {
    const created = await create();
    ofss.findOne.mockResolvedValue({
      id: ofsId,
      departements: [{ id: 'department' }],
    });
    contacts.findApiContactLines.mockResolvedValue([
      [
        {
          simulationId: randomUUID(),
          locationId: randomUUID(),
          submittedAt: new Date(),
          email: 'contact@example.test',
          internalField: 'private',
        },
      ],
      3,
    ]);
    const result = await request(app.getHttpServer())
      .get(`/api/v1/leads?ofsId=${ofsId}&pageSize=1`)
      .auth(created.token, { type: 'bearer' })
      .expect(200);
    expect(result.headers['cache-control']).toBe('no-store');
    expect(result.body).toMatchObject({
      totalCount: 3,
      pageSize: 1,
      hasNextPage: true,
    });
    expect(result.body.items[0]).not.toHaveProperty('internalField');
    expect(contacts.findApiContactLines).toHaveBeenCalledWith(
      { page: 1, pageSize: 1 },
      { ofsId, departementIds: ['department'] },
    );
    expect(stored[0].lastUsedAt).toBeInstanceOf(Date);
    expect(audit.record).toHaveBeenCalledWith(
      expect.objectContaining({
        actor: expect.objectContaining({ ref: `api_key:${created.id}` }),
      }),
    );
    await request(app.getHttpServer())
      .get('/api/v1/leads?pageSize=151')
      .auth(created.token, { type: 'bearer' })
      .expect(400);
    await request(app.getHttpServer())
      .get('/api/v1/leads?ofsId=invalid')
      .auth(created.token, { type: 'bearer' })
      .expect(400);
    await request(app.getHttpServer())
      .get('/api/v1/leads')
      .auth(created.token, { type: 'bearer' })
      .expect(400);
    owner.ofss = [];
    await request(app.getHttpServer())
      .get(`/api/v1/leads?ofsId=${ofsId}`)
      .auth(created.token, { type: 'bearer' })
      .expect(404);
    owner.isActive = false;
    await request(app.getHttpServer())
      .get(`/api/v1/leads?ofsId=${ofsId}`)
      .auth(created.token, { type: 'bearer' })
      .expect(401);
  });

  it('uses the current commercialisateur identity and filter without accepting client-provided permissions', async () => {
    const created = await create();
    const distributorId = randomUUID();
    owner.roles = [UserRole.DISTRIBUTOR];
    owner.distributor = { id: distributorId } as UserEntity['distributor'];
    contacts.findApiContactLines.mockResolvedValue([[], 0]);
    const result = await request(app.getHttpServer())
      .get(`/api/v1/leads?ofsId=${ofsId}`)
      .auth(created.token, { type: 'bearer' })
      .expect(200);
    expect(result.body.items).toEqual([]);
    expect(contacts.findApiContactLines).toHaveBeenCalledWith(
      expect.anything(),
      { distributorId, ofsId },
    );
    await request(app.getHttpServer())
      .get(`/api/v1/leads?distributorId=${randomUUID()}`)
      .auth(created.token, { type: 'bearer' })
      .expect(400);
  });

  it('rejects session-only access, invalid tokens, and user keys on other APIs and methods', async () => {
    const created = await create();
    await request(app.getHttpServer())
      .get('/api/v1/leads')
      .set('x-test-user', owner.id)
      .expect(401);
    await request(app.getHttpServer())
      .get('/api/v1/leads')
      .auth('wrong', { type: 'bearer' })
      .expect(401);
    await request(app.getHttpServer())
      .get('/api/portal/api-keys')
      .auth(created.token, { type: 'bearer' })
      .expect(401);
    await request(app.getHttpServer())
      .post('/api/portal/api-keys')
      .auth(created.token, { type: 'bearer' })
      .send({ name: 'another' })
      .expect(401);
    await request(app.getHttpServer())
      .get('/internal')
      .set('x-api-key', created.token)
      .expect(401);
    await request(app.getHttpServer())
      .post('/api/v1/leads')
      .auth(created.token, { type: 'bearer' })
      .send({})
      .expect(404);
  });

  it('enforces the per-key rate limit before returning contacts', async () => {
    const created = await create();
    rateLimit.consume.mockRejectedValueOnce(
      new HttpException('Too many requests', 429),
    );
    await request(app.getHttpServer())
      .get(`/api/v1/leads?ofsId=${ofsId}`)
      .auth(created.token, { type: 'bearer' })
      .expect(429);
    expect(contacts.findApiContactLines).not.toHaveBeenCalled();
    expect(stored[0].lastUsedAt).toBeNull();
  });

  it('rejects empty and overly long key names', async () => {
    await request(app.getHttpServer())
      .post('/api/portal/api-keys')
      .set('x-test-user', owner.id)
      .send({ name: '   ' })
      .expect(400);
    await request(app.getHttpServer())
      .post('/api/portal/api-keys')
      .set('x-test-user', owner.id)
      .send({ name: 'x'.repeat(101) })
      .expect(400);
  });
});
