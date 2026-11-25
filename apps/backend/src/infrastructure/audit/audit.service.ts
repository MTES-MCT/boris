import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { DataSource, EntityManager } from 'typeorm';
import { AuditActor, currentAuditContext } from './audit-context';
import { AuditEventEntity } from './audit-event.entity';
import { AuditEventResourceEntity } from './audit-event-resource.entity';

export const EVENT_TYPES = [
  'auth.login_succeeded',
  'auth.login_failed',
  'auth.rate_limited',
  'auth.recovery_code_used',
  'auth.logout',
  'auth.sessions_revoked',
  'account.created',
  'account.activation_changed',
  'account.role_changed',
  'account.membership_changed',
  'account.email_changed',
  'account.profile_changed',
  'account.password_changed',
  'account.password_reset_requested',
  'account.password_reset_completed',
  'account.two_factor_enabled',
  'account.two_factor_disabled',
  'account.two_factor_reset',
  'invitation.created',
  'invitation.resent',
  'invitation.cancelled',
  'invitation.accepted',
  'organization.link_changed',
  'commercial_transmission.created',
  'commercial_transmission.scope_changed',
  'commercial_transmission.activation_changed',
  'programme.created',
  'programme.updated',
  'programme.deleted',
  'ofs.created',
  'ofs.updated',
  'ofs.deleted',
  'commercialisateur.created',
  'commercialisateur.updated',
  'commercialisateur.deleted',
  'contact_followup.updated',
  'notification_preference.updated',
  'contacts.released',
  'contacts.export_requested',
  'contacts.export_released',
  'contacts.export_failed',
  'security.access_denied',
  'security.request_rejected',
  'notification.delivery_attempted',
  'notification.delivery_accepted',
  'notification.delivery_failed',
] as const;
export type AuditEventType = (typeof EVENT_TYPES)[number];
type Value = string | number | boolean | null | string[];
export type AuditChanges = Record<string, { before: Value; after: Value }>;
export type AuditResource = {
  resourceType: string;
  resourceId: string;
  simulationId?: string | null;
  ofsId?: string | null;
  distributorId?: string | null;
};
export type AuditEvent = {
  type: AuditEventType;
  outcome?: 'succeeded' | 'failed' | 'denied';
  actor?: AuditActor;
  targetType?: string;
  targetId?: string;
  ofsId?: string | null;
  distributorId?: string | null;
  reasonCode?: string;
  changes?: AuditChanges;
  metadata?: {
    method?: string;
    httpMethod?: string;
    route?: string;
    stage?: string;
    count?: number;
    format?: string;
    startDate?: string;
    endDate?: string;
    status?: number;
    invitationRole?: string;
    jobId?: string;
    attempts?: number;
  };
  resources?: AuditResource[];
};
export class AuditPersistenceError extends Error {
  constructor() {
    super('Audit event persistence failed');
  }
}
const logger = new Logger('Audit');
const changeKeys = new Set([
  'email',
  'firstName',
  'lastName',
  'roles',
  'isActive',
  'ofsIds',
  'distributorId',
  'name',
  'phone',
  'websiteUrl',
  'producesBrs',
  'isPartner',
  'departementIds',
  'regionIds',
  'distributorIds',
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
  'ofsId',
  'isDeleted',
  'scopeType',
  'inseeCodes',
  'departementCodes',
  'action',
  'status',
  'frequency',
  'role',
  'expiresAt',
  'acceptedAt',
]);
const metadataKeys = new Set([
  'method',
  'httpMethod',
  'route',
  'stage',
  'count',
  'format',
  'startDate',
  'endDate',
  'status',
  'invitationRole',
  'jobId',
  'attempts',
]);

/** Insert only; the supplied manager must belong to the business/release transaction. */
export async function recordAudit(
  manager: EntityManager,
  event: AuditEvent,
): Promise<void> {
  if (!manager.queryRunner?.isTransactionActive)
    throw new Error('Audit writes require a transaction');
  if (!EVENT_TYPES.includes(event.type)) throw new Error('Unknown audit event');
  for (const [key, change] of Object.entries(event.changes || {})) {
    if (
      !changeKeys.has(key) ||
      !change ||
      Object.keys(change).some((k) => !['before', 'after'].includes(k))
    )
      throw new Error('Invalid audit change');
    for (const value of [change.before, change.after]) {
      if (
        !(
          value === null ||
          ['string', 'number', 'boolean'].includes(typeof value) ||
          (Array.isArray(value) &&
            value.every((item) => typeof item === 'string'))
        )
      )
        throw new Error('Invalid audit change value');
    }
  }
  for (const [key, value] of Object.entries(event.metadata || {})) {
    if (!metadataKeys.has(key) || !['string', 'number'].includes(typeof value))
      throw new Error('Invalid audit metadata');
  }
  if (
    Buffer.byteLength(
      JSON.stringify({
        changes: event.changes || {},
        metadata: event.metadata || {},
      }),
    ) > 16384
  )
    throw new Error('Audit payload too large');
  const context = currentAuditContext();
  const actor = event.actor || context.actor();
  const id = randomUUID();
  try {
    await manager.insert(AuditEventEntity, {
      id,
      schemaVersion: 1,
      occurredAt: new Date(),
      eventType: event.type,
      outcome: event.outcome || 'succeeded',
      actorKind: actor.kind,
      actorId: actor.id || null,
      actorRef: actor.ref || null,
      actorRoles: actor.roles || [],
      ofsId: event.ofsId || null,
      distributorId: event.distributorId || null,
      targetType: event.targetType || null,
      targetId: event.targetId || null,
      requestId: context.requestId,
      operationId: context.operationId,
      reasonCode: event.reasonCode || null,
      changes: event.changes || {},
      metadata: { ...context.request?.(), ...event.metadata },
    });
    const unique = new Map<string, AuditResource>();
    for (const r of event.resources || []) {
      const resource = {
        resourceType: r.resourceType,
        resourceId: r.resourceId,
        simulationId: r.simulationId || null,
        ofsId: r.ofsId || null,
        distributorId: r.distributorId || null,
      };
      unique.set(JSON.stringify(resource), resource);
    }
    const resources = [...unique.values()].map((resource, ordinal) => ({
      ...resource,
      eventId: id,
      ordinal,
    }));
    for (let offset = 0; offset < resources.length; offset += 1000)
      await manager.insert(
        AuditEventResourceEntity,
        resources.slice(offset, offset + 1000),
      );
  } catch {
    throw new AuditPersistenceError();
  }
}

@Injectable()
export class AuditService {
  constructor(private readonly database: DataSource) {}
  record(event: AuditEvent): Promise<void> {
    return this.database.transaction((manager) => recordAudit(manager, event));
  }
  /** Denials and access-reducing operations must remain effective during an audit outage. */
  async attempt(event: AuditEvent): Promise<void> {
    try {
      await this.record(event);
    } catch {
      logger.error('Audit event persistence failed');
    }
  }
}
