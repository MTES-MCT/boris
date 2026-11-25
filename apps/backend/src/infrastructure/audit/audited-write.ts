import { Logger } from '@nestjs/common';
import {
  DeepPartial,
  EntityManager,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
  UpdateResult,
  DeleteResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import {
  AuditChanges,
  AuditEventType,
  AuditPersistenceError,
  AuditService,
  recordAudit,
} from './audit.service';

type Config = { name: string; fields: string[]; relations?: string[] };
const configs: Record<string, Config> = {
  user: {
    name: 'account',
    fields: [
      'email',
      'firstName',
      'lastName',
      'roles',
      'isActive',
      'ofss',
      'distributor',
    ],
    relations: ['ofss', 'distributor'],
  },
  ofs: {
    name: 'ofs',
    fields: [
      'name',
      'email',
      'phone',
      'websiteUrl',
      'producesBrs',
      'isPartner',
      'departements',
      'regions',
      'distributors',
    ],
    relations: ['departements', 'regions', 'distributors'],
  },
  distributor: {
    name: 'commercialisateur',
    fields: ['name', 'websiteUrl', 'ofss'],
    relations: ['ofss'],
  },
  brs_diffusion_website: {
    name: 'programme',
    fields: [
      'programName',
      'ofsName',
      'distributorName',
      'source',
      'address',
      'city',
      'zipcode',
      'inseeCode',
      'deliveryMonth',
      'housingType',
      'latitude',
      'longitude',
      'isDeleted',
      'ofs',
      'distributor',
    ],
    relations: ['ofs', 'distributor'],
  },
  commercial_transmission: {
    name: 'commercial_transmission',
    fields: [
      'ofsId',
      'distributorId',
      'isActive',
      'scopeType',
      'inseeCodes',
      'departementCodes',
    ],
  },
  ofs_eligibility_simulation: {
    name: 'contact_followup',
    fields: ['action', 'status'],
  },
  distributor_eligibility_simulation: {
    name: 'contact_followup',
    fields: ['action', 'status'],
  },
  portal_invitation: {
    name: 'invitation',
    fields: ['role', 'status', 'expiresAt', 'acceptedAt'],
  },
  portal_lead_notification_preference: {
    name: 'notification_preference',
    fields: ['frequency'],
  },
};
const relationNames: Record<string, string> = {
  ofss: 'ofsIds',
  distributor: 'distributorId',
  ofs: 'ofsId',
  departements: 'departementIds',
  regions: 'regionIds',
  distributors: 'distributorIds',
};
function snapshot(
  row: ObjectLiteral | null,
  config: Config,
): Record<string, string | string[] | number | boolean | null> {
  const result: ReturnType<typeof snapshot> = {};
  for (const field of config.fields) {
    let value = row?.[field] ?? null;
    if (relationNames[field]) {
      value = ['ofss', 'departements', 'regions', 'distributors'].includes(
        field,
      )
        ? (value || []).map((item: { id: string }) => item.id).sort()
        : value?.id || null;
    } else if (value instanceof Date) value = value.toISOString();
    else if (Array.isArray(value)) value = [...value].sort();
    result[relationNames[field] || field] = value;
  }
  return result;
}
export async function inAuditTransaction<T>(
  manager: EntityManager,
  work: (manager: EntityManager) => Promise<T>,
): Promise<T> {
  return manager.queryRunner?.isTransactionActive
    ? work(manager)
    : manager.transaction(work);
}
async function entityEvent<T extends ObjectLiteral>(
  repository: Repository<T>,
  before: T | null,
  after: T | null,
) {
  const config = configs[repository.metadata.tableName];
  if (!config) throw new Error('Entity is not configured for auditing');
  const row = after || before!;
  const oldValues = snapshot(before, config),
    newValues = snapshot(after, config);
  const changes: AuditChanges = {};
  for (const key of Object.keys(newValues)) {
    if (JSON.stringify(oldValues[key]) !== JSON.stringify(newValues[key]))
      changes[key] = { before: oldValues[key], after: newValues[key] };
  }
  const base = {
    targetType: config.name,
    targetId: row.eligibilitySimulationId || row.id,
    ofsId: row.ofsId || (config.name === 'ofs' ? row.id : row.ofs?.id),
    distributorId:
      row.distributorId ||
      (config.name === 'commercialisateur' ? row.id : row.distributor?.id),
  };
  const emit = (type: AuditEventType, selected = changes) =>
    recordAudit(repository.manager, { ...base, type, changes: selected });
  if (config.name === 'account') {
    if (!before) {
      await emit('account.created');
      return;
    }
    const groups: [AuditEventType, string[]][] = [
      ['account.email_changed', ['email']],
      ['account.profile_changed', ['firstName', 'lastName']],
      ['account.role_changed', ['roles']],
      ['account.activation_changed', ['isActive']],
      ['account.membership_changed', ['ofsIds', 'distributorId']],
    ];
    for (const [type, fields] of groups) {
      const selected = Object.fromEntries(
        Object.entries(changes).filter(([key]) => fields.includes(key)),
      );
      if (Object.keys(selected).length) await emit(type, selected);
    }
    if (after && before.password !== after.password)
      await emit('account.password_changed', {});
    return;
  }
  if (config.name === 'invitation') {
    const type = !before
      ? 'invitation.created'
      : after?.status === 'accepted' && before.status !== after.status
        ? 'invitation.accepted'
        : after?.status === 'cancelled' && before.status !== after.status
          ? 'invitation.cancelled'
          : before.tokenHash !== after?.tokenHash
            ? 'invitation.resent'
            : null;
    if (type) await emit(type);
    return;
  }
  if (!Object.keys(changes).length && before && after) return;
  if (config.name === 'commercial_transmission') {
    if (!before) await emit('commercial_transmission.created');
    else {
      const scope = Object.fromEntries(
        Object.entries(changes).filter(([key]) => key !== 'isActive'),
      );
      if (Object.keys(scope).length)
        await emit('commercial_transmission.scope_changed', scope);
      if (changes.isActive)
        await emit('commercial_transmission.activation_changed', {
          isActive: changes.isActive,
        });
    }
  } else if (config.name === 'contact_followup')
    await emit('contact_followup.updated');
  else if (config.name === 'notification_preference')
    await emit('notification_preference.updated');
  else {
    const verb =
      !after || (after.isDeleted && !before?.isDeleted)
        ? 'deleted'
        : !before
          ? 'created'
          : 'updated';
    await emit(`${config.name}.${verb}` as AuditEventType);
    if (config.name === 'ofs' && changes.distributorIds)
      await emit('organization.link_changed', {
        distributorIds: changes.distributorIds,
      });
    if (config.name === 'commercialisateur' && changes.ofsIds)
      await emit('organization.link_changed', { ofsIds: changes.ofsIds });
  }
}
function entityId(row: ObjectLiteral): string {
  const id: unknown = row.id;
  if (typeof id !== 'string')
    throw new Error('Audited entity needs a string ID');
  return id;
}

async function lockedRow<T extends ObjectLiteral>(
  repository: Repository<T>,
  id: string,
): Promise<T | null> {
  const row = await repository.findOne({
    where: { id } as unknown as FindOptionsWhere<T>,
    lock: { mode: 'pessimistic_write' },
  });
  if (!row) return null;
  const relations = configs[repository.metadata.tableName]?.relations;
  return relations?.length
    ? repository.findOne({
        where: { id } as unknown as FindOptionsWhere<T>,
        relations,
      })
    : row;
}
export async function auditedSave<T extends ObjectLiteral>(
  repository: Repository<T>,
  value: NoInfer<DeepPartial<T>>,
): Promise<T> {
  // Save can merge nullable defaults into the caller's entity even when its transaction rolls back.
  const requested = Object.assign({}, value) as DeepPartial<T>;
  try {
    return await inAuditTransaction(repository.manager, async (manager) => {
      const repo = manager.getRepository(repository.target);
      const before = (value as ObjectLiteral).id
        ? await lockedRow(repo, entityId(value as ObjectLiteral))
        : null;
      // Copy before the caller's object is mutated by save (notably generated defaults and IDs).
      const saved = await repo.save(value);
      const after = await repo.findOneOrFail({
        where: { id: saved.id } as unknown as FindOptionsWhere<T>,
        relations: configs[repo.metadata.tableName]?.relations,
      });
      await entityEvent(repo, before, after);
      return saved;
    });
  } catch (error) {
    // A compromised account must still be disableable when only audit storage is unavailable.
    // The original transaction has rolled back; re-read and apply only verified removals.
    if (
      !(error instanceof AuditPersistenceError) ||
      repository.metadata.tableName !== 'user' ||
      repository.manager.queryRunner?.isTransactionActive
    )
      throw error;
    const revoked = await revokeWithoutAudit(repository, requested);
    if (!revoked) throw error;
    new Logger('Audit').error(
      'Account access reduced without an audit event because audit storage failed',
    );
    return revoked;
  }
}

async function revokeWithoutAudit<T extends ObjectLiteral>(
  repository: Repository<T>,
  value: DeepPartial<T>,
): Promise<T | null> {
  return repository.manager.transaction(async (manager) => {
    const repo = manager.getRepository(repository.target);
    const current = await lockedRow(repo, entityId(value as ObjectLiteral));
    if (!current) return null;
    const proposed = Object.fromEntries(
      Object.entries(value).filter(([, field]) => field !== undefined),
    );
    // TypeORM can merge database defaults into the caller's entity even on a failed save.
    // Compare supplied credential fields with fresh locked state, then never write them in this fallback.
    const credentials = await repo
      .createQueryBuilder('account')
      .addSelect([
        'account.twoFactorSecret',
        'account.twoFactorRecoveryCodes',
        'account.twoFactorLastUsedStep',
      ])
      .where('account.id = :id', { id: current.id })
      .getOneOrFail();
    if (
      [
        'twoFactorSecret',
        'twoFactorRecoveryCodes',
        'twoFactorLastUsedStep',
      ].some(
        (key) =>
          proposed[key] !== undefined &&
          JSON.stringify(proposed[key]) !== JSON.stringify(credentials[key]),
      )
    )
      return null;
    if (
      proposed.password !== undefined &&
      proposed.password !== current.password
    )
      return null;
    const config = configs.user;
    const before = snapshot(current, config),
      after = snapshot({ ...current, ...proposed }, config);
    const removalKeys = ['isActive', 'ofsIds', 'distributorId'];
    if (
      Object.keys(before).some(
        (key) =>
          !removalKeys.includes(key) &&
          JSON.stringify(before[key]) !== JSON.stringify(after[key]),
      )
    )
      return null;
    if (after.isActive && !before.isActive) return null;
    const oldOfs = before.ofsIds as string[],
      nextOfs = after.ofsIds as string[];
    if (nextOfs.some((id) => !oldOfs.includes(id))) return null;
    if (
      after.distributorId !== before.distributorId &&
      after.distributorId !== null
    )
      return null;
    const removed = oldOfs.filter((id) => !nextOfs.includes(id));
    const disable = before.isActive === true && after.isActive === false;
    const detach =
      before.distributorId !== null && after.distributorId === null;
    if (!disable && !detach && !removed.length) return null;
    if (disable || detach)
      await repo.update(entityId(current), {
        ...(disable ? { isActive: false } : {}),
        ...(detach ? { distributor: null } : {}),
      } as unknown as QueryDeepPartialEntity<T>);
    if (removed.length)
      await repo
        .createQueryBuilder()
        .relation('ofss')
        .of(current.id)
        .remove(removed);
    return repo.findOneOrFail({
      where: { id: current.id } as unknown as FindOptionsWhere<T>,
      relations: config.relations,
    });
  });
}

export async function auditedUpdate<T extends ObjectLiteral>(
  repository: Repository<T>,
  criteria: string | FindOptionsWhere<T>,
  patch: QueryDeepPartialEntity<T>,
): Promise<UpdateResult> {
  return inAuditTransaction(repository.manager, async (manager) => {
    const repo = manager.getRepository(repository.target);
    const where =
      typeof criteria === 'string'
        ? ({ id: criteria } as unknown as FindOptionsWhere<T>)
        : criteria;
    const rows = await repo
      .createQueryBuilder('audited')
      .setFindOptions({ where })
      .setLock('pessimistic_write', undefined, ['audited'])
      .getMany();
    for (const row of rows) {
      const before = await lockedRow(repo, entityId(row));
      await repo.update(entityId(row), patch);
      const after = await repo.findOneOrFail({
        where: { id: row.id } as unknown as FindOptionsWhere<T>,
        relations: configs[repo.metadata.tableName]?.relations,
      });
      await entityEvent(repo, before, after);
    }
    return { affected: rows.length, generatedMaps: [], raw: [] };
  });
}
export async function auditedDelete<T extends ObjectLiteral>(
  repository: Repository<T>,
  criteria: string | FindOptionsWhere<T>,
): Promise<DeleteResult> {
  return inAuditTransaction(repository.manager, async (manager) => {
    const repo = manager.getRepository(repository.target);
    const where =
      typeof criteria === 'string'
        ? ({ id: criteria } as unknown as FindOptionsWhere<T>)
        : criteria;
    const rows = await repo
      .createQueryBuilder('audited')
      .setFindOptions({ where })
      .setLock('pessimistic_write', undefined, ['audited'])
      .getMany();
    for (const row of rows) {
      const before = await lockedRow(repo, entityId(row));
      await repo.delete(entityId(row));
      await entityEvent(repo, before, null);
    }
    return { affected: rows.length, raw: [] };
  });
}

/** Explicit scope-denial hook; keep the caller's enumeration-safe response unchanged. */
export async function auditDenied(
  repository: Repository<ObjectLiteral>,
  reasonCode: string,
  targetId?: string,
  targetType?: string,
): Promise<void> {
  await new AuditService(repository.manager.connection).attempt({
    type: 'security.access_denied',
    outcome: 'denied',
    reasonCode,
    ...(targetId &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      targetId,
    )
      ? {
          targetId,
          targetType:
            targetType || configs[repository.metadata.tableName]?.name,
        }
      : {}),
  });
}
