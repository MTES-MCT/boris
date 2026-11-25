import { BrsDiffusionWebsiteEntity } from 'src/infrastructure/brs-diffusion-website/brs-diffusion-website.entity';
import { randomUUID } from 'node:crypto';
import { DataSource } from 'typeorm';
import { typeormConfig } from 'src/infrastructure/persistence/typeorm.config';
import { CreateAuditLog1795600000000 } from 'src/infrastructure/persistence/migrations/1795600000000-create_audit_log';
import { AuditEventEntity } from 'src/infrastructure/audit/audit-event.entity';
import { AuditEventResourceEntity } from 'src/infrastructure/audit/audit-event-resource.entity';
import {
  AuditService,
  recordAudit,
} from 'src/infrastructure/audit/audit.service';
import {
  auditedSave,
  auditedUpdate,
  auditedDelete,
} from 'src/infrastructure/audit/audited-write';
import { withAuditContext } from 'src/infrastructure/audit/audit-context';
import { OfsEntity } from 'src/infrastructure/ofs/ofs.entity';
import { UserEntity } from 'src/infrastructure/user/user.entity';
import { UserRole } from 'src/domain/user/user-role.enum';
import {
  CommercialTransmissionEntity,
  CommercialTransmissionScopeType,
} from 'src/infrastructure/ofs/commercial-transmission.entity';
import { DistributorEntity } from 'src/infrastructure/distributor/distributor.entity';

const databaseUrl = process.env.AUDIT_TEST_DATABASE_URL;
const describeDatabase = databaseUrl ? describe : describe.skip;
describeDatabase('Application audit trail (isolated PostgreSQL schema)', () => {
  let db: DataSource;
  const schema = `audit_test_${randomUUID().replace(/-/g, '')}`;
  const actorId = randomUUID();
  const actor = { kind: 'user' as const, id: actorId, roles: ['admin'] };
  const act = <T>(work: () => Promise<T>) => withAuditContext(actor, work);
  const events = () =>
    db.getRepository(AuditEventEntity).find({ order: { recordedAt: 'ASC' } });

  beforeAll(async () => {
    db = await new DataSource({
      type: 'postgres',
      url: databaseUrl,
      schema,
      entities: typeormConfig.entities,
      extra: { options: `-c search_path=${schema},public` },
    }).initialize();
    await db.query(`CREATE SCHEMA "${schema}"`);
    await db.synchronize();
    // Exercise the real additive migration rather than relying solely on synchronize.
    const runner = db.createQueryRunner();
    await new CreateAuditLog1795600000000().down(runner);
    await new CreateAuditLog1795600000000().up(runner);
    await runner.release();
  }, 30_000);
  beforeEach(async () => {
    await db.query('TRUNCATE audit_event CASCADE');
  });
  afterAll(async () => {
    if (db?.isInitialized) {
      await db.query(`DROP SCHEMA "${schema}" CASCADE`);
      await db.destroy();
    }
  });

  it('records the authenticated actor, organization and selected before/after values, suppressing no-ops', async () => {
    const repo = db.getRepository(OfsEntity);
    const ofs = await act(() =>
      auditedSave(
        repo,
        new OfsEntity('Initial', null, null, null, true, true, [], [], []),
      ),
    );
    await act(() => auditedUpdate(repo, ofs.id, { name: 'Updated' }));
    await act(() => auditedUpdate(repo, ofs.id, { name: 'Updated' }));
    const rows = await events();
    expect(rows.map((row) => row.eventType)).toEqual([
      'ofs.created',
      'ofs.updated',
    ]);
    expect(rows[1]).toMatchObject({
      actorKind: 'user',
      actorId,
      actorRoles: ['admin'],
      ofsId: ofs.id,
      changes: { name: { before: 'Initial', after: 'Updated' } },
    });
    expect(rows[1].requestId).toMatch(/^[a-f0-9-]{36}$/);
  });

  it('rolls back both the mutation and audit if the outer business transaction fails', async () => {
    const repo = db.getRepository(OfsEntity);
    const ofs = await repo.save(
      new OfsEntity('Original', null, null, null, true, true, [], [], []),
    );
    await expect(
      act(() =>
        db.transaction(async (manager) => {
          await auditedUpdate(manager.getRepository(OfsEntity), ofs.id, {
            name: 'Uncommitted',
          });
          throw new Error('business failure');
        }),
      ),
    ).rejects.toThrow('business failure');
    expect((await repo.findOneByOrFail({ id: ofs.id })).name).toBe('Original');
    expect(await events()).toHaveLength(0);
    await act(() =>
      new AuditService(db).record({
        type: 'security.access_denied',
        outcome: 'denied',
        reasonCode: 'BUSINESS_DENIED',
      }),
    );
    expect((await events())[0].outcome).toBe('denied');
  });

  it('rolls back a business change when the audit insert fails', async () => {
    const repo = db.getRepository(OfsEntity);
    const ofs = await repo.save(
      new OfsEntity('Original', null, null, null, true, true, [], [], []),
    );
    await db.query(
      "ALTER TABLE audit_event ADD CONSTRAINT audit_test_failure CHECK (event_type <> 'ofs.updated')",
    );
    try {
      await expect(
        act(() => auditedUpdate(repo, ofs.id, { name: 'Must roll back' })),
      ).rejects.toThrow();
      expect((await repo.findOneByOrFail({ id: ofs.id })).name).toBe(
        'Original',
      );
      expect(await events()).toHaveLength(0);
    } finally {
      await db.query(
        'ALTER TABLE audit_event DROP CONSTRAINT audit_test_failure',
      );
    }
  });

  it('records password changes without hashes, secrets, IPs or supplied request fields', async () => {
    const repo = db.getRepository(UserEntity);
    const user = await act(() =>
      auditedSave(
        repo,
        new UserEntity(`${randomUUID()}@test.invalid`, 'hash-before', [
          UserRole.ADMIN,
        ]),
      ),
    );
    user.password = 'hash-after';
    await act(() => auditedSave(repo, user));
    const rows = await events();
    expect(rows.map((row) => row.eventType)).toEqual([
      'account.created',
      'account.password_changed',
    ]);
    expect(rows[1].changes).toEqual({});
    const serialized = JSON.stringify(rows);
    for (const secret of [
      'hash-before',
      'hash-after',
      'twoFactorSecret',
      'cookie',
      'client_ip',
      'user_agent',
    ])
      expect(serialized).not.toContain(secret);
    await expect(
      act(() =>
        new AuditService(db).record({
          type: 'auth.login_failed',
          metadata: { ip: '198.51.100.4' } as never,
        }),
      ),
    ).rejects.toThrow('Invalid audit metadata');
    await expect(
      act(() =>
        new AuditService(db).record({
          type: 'account.password_changed',
          changes: { password: { before: 'hash-before', after: 'hash-after' } },
        }),
      ),
    ).rejects.toThrow('Invalid audit change');
  });

  it('keeps actor and target evidence after deletion and rolls back a failed manifest atomically', async () => {
    const ofs = await db
      .getRepository(OfsEntity)
      .save(new OfsEntity('Deleted', null, null, null, true, true, [], [], []));
    await act(() => auditedDelete(db.getRepository(OfsEntity), ofs.id));
    expect((await events())[0]).toMatchObject({
      eventType: 'ofs.deleted',
      targetId: ofs.id,
      actorId,
    });
    const priorCount = (await events()).length;
    await expect(
      act(() =>
        new AuditService(db).record({
          type: 'contacts.export_released',
          metadata: { count: 1 },
          resources: [
            { resourceType: 'contact_line', resourceId: 'invalid-uuid' },
          ],
        }),
      ),
    ).rejects.toThrow();
    expect(await events()).toHaveLength(priorCount);
  });

  it('stores complete batched export manifests including distinct organization scopes', async () => {
    const ids = Array.from({ length: 1005 }, () => randomUUID());
    const ofsId = randomUUID(),
      otherOfsId = randomUUID(),
      simulationId = randomUUID();
    const resources = ids.map((id) => ({
      resourceType: 'contact_line',
      resourceId: id,
      ofsId,
      simulationId,
    }));
    resources.push({ ...resources[0], ofsId: otherOfsId }, resources[0]);
    await act(() =>
      new AuditService(db).record({
        type: 'contacts.export_released',
        ofsId,
        metadata: { count: 1005, format: 'xlsx' },
        resources,
      }),
    );
    const [event] = await events();
    const manifest = await db
      .getRepository(AuditEventResourceEntity)
      .find({ where: { eventId: event.id }, order: { ordinal: 'ASC' } });
    expect(manifest).toHaveLength(1006);
    expect(manifest[1005]).toMatchObject({
      resourceId: ids[0],
      ofsId: otherOfsId,
    });
    expect(manifest.map((r) => r.ordinal)).toEqual(
      Array.from({ length: 1006 }, (_, i) => i),
    );
  });

  it('serializes concurrent transmission changes and preserves the actual preceding scope', async () => {
    const ofs = await db
      .getRepository(OfsEntity)
      .save(
        new OfsEntity('Concurrent', null, null, null, true, true, [], [], []),
      );
    const distributor = await db
      .getRepository(DistributorEntity)
      .save(new DistributorEntity('Distributor', '', []));
    const repo = db.getRepository(CommercialTransmissionEntity);
    const transmission = await repo.save({
      ofsId: ofs.id,
      distributorId: distributor.id,
      isActive: true,
      scopeType: CommercialTransmissionScopeType.GEOGRAPHIC,
      inseeCodes: [],
      departementCodes: ['01'],
    });
    await Promise.all([
      act(() =>
        auditedUpdate(repo, transmission.id, { departementCodes: ['02'] }),
      ),
      act(() =>
        auditedUpdate(repo, transmission.id, { departementCodes: ['03'] }),
      ),
    ]);
    const rows = await events();
    expect(rows).toHaveLength(2);
    expect(rows[0].changes.departementCodes).toMatchObject({ before: ['01'] });
    expect(rows[1].changes.departementCodes).toMatchObject({
      before: (rows[0].changes.departementCodes as { after: unknown }).after,
    });
  });

  it('deletes a programme using its nested OFS ownership predicate without locking a nullable join', async () => {
    const ofs = await db
      .getRepository(OfsEntity)
      .save(new OfsEntity('Owner', null, null, null, true, true, [], [], []));
    const repo = db.getRepository(BrsDiffusionWebsiteEntity);
    const program = await repo.save({
      source: 'https://example.test',
      city: 'Paris',
      zipcode: '75001',
      address: '1 rue du Test',
      inseeCode: '75056',
      latitude: 48,
      longitude: 2,
      ofs,
    });
    await act(() =>
      auditedUpdate(
        repo,
        { id: program.id, ofs: { id: ofs.id }, isDeleted: false },
        { isDeleted: true },
      ),
    );
    expect((await repo.findOneByOrFail({ id: program.id })).isDeleted).toBe(
      true,
    );
    expect((await events())[0].eventType).toBe('programme.deleted');
  });

  it('allows pure account disablement during an audit outage but never a mixed permission grant', async () => {
    const repo = db.getRepository(UserEntity);
    let user = await repo.save(
      new UserEntity(`${randomUUID()}@test.invalid`, 'unchanged', [
        UserRole.ADMIN,
      ]),
    );
    await db.query('UPDATE "user" SET "twoFactorSecret" = $2 WHERE id = $1', [
      user.id,
      'existing-encrypted-secret',
    ]);
    // Application account-management loads do not select credential secrets/defaults.
    user = await repo.findOneByOrFail({ id: user.id });
    await db.query(
      "ALTER TABLE audit_event ADD CONSTRAINT audit_test_disable_failure CHECK (event_type <> 'account.activation_changed')",
    );
    try {
      user.isActive = false;
      user.roles = [UserRole.OFS];
      await expect(act(() => auditedSave(repo, user))).rejects.toThrow(
        'Audit event persistence failed',
      );
      expect((await repo.findOneByOrFail({ id: user.id })).isActive).toBe(true);
      user = await repo.findOneByOrFail({ id: user.id });
      user.isActive = false;
      await act(() => auditedSave(repo, user));
      expect((await repo.findOneByOrFail({ id: user.id })).isActive).toBe(
        false,
      );
      expect(await events()).toHaveLength(0);
      const credentials = await repo
        .createQueryBuilder('account')
        .addSelect('account.twoFactorSecret')
        .where('account.id = :id', { id: user.id })
        .getOneOrFail();
      expect(credentials.twoFactorSecret).toBe('existing-encrypted-secret');
    } finally {
      await db.query(
        'ALTER TABLE audit_event DROP CONSTRAINT audit_test_disable_failure',
      );
    }
  });

  it('rejects non-transactional audit writes and isolates actor context across concurrent tasks', async () => {
    await expect(
      recordAudit(db.manager, { type: 'auth.login_succeeded' }),
    ).rejects.toThrow('transaction');
    const other = randomUUID();
    await Promise.all([
      act(() => new AuditService(db).record({ type: 'auth.login_succeeded' })),
      withAuditContext({ kind: 'user', id: other }, () =>
        new AuditService(db).record({ type: 'auth.login_succeeded' }),
      ),
    ]);
    expect(new Set((await events()).map((row) => row.actorId))).toEqual(
      new Set([actorId, other]),
    );
  });
});
