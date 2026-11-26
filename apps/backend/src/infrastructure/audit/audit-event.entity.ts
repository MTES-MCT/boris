import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('audit_event')
export class AuditEventEntity {
  @PrimaryColumn('uuid') id: string;
  @Column({ name: 'schema_version', type: 'smallint', default: 1 })
  schemaVersion: number;
  @Column({ name: 'occurred_at', type: 'timestamptz' }) occurredAt: Date;
  @Column({
    name: 'recorded_at',
    type: 'timestamptz',
    default: () => 'clock_timestamp()',
  })
  recordedAt: Date;
  @Column({ name: 'event_type', type: 'varchar', length: 100 })
  eventType: string;
  @Column({ type: 'varchar', length: 16 }) outcome: string;
  @Column({ name: 'actor_kind', type: 'varchar', length: 16 })
  actorKind: string;
  @Column({ name: 'actor_id', type: 'uuid', nullable: true }) actorId:
    | string
    | null;
  @Column({ name: 'actor_ref', type: 'varchar', length: 200, nullable: true })
  actorRef: string | null;
  @Column({ name: 'actor_roles', type: 'jsonb', default: () => "'[]'" })
  actorRoles: string[];
  @Column({ name: 'ofs_id', type: 'uuid', nullable: true }) ofsId:
    | string
    | null;
  @Column({ name: 'distributor_id', type: 'uuid', nullable: true })
  distributorId: string | null;
  @Column({ name: 'target_type', type: 'varchar', length: 64, nullable: true })
  targetType: string | null;
  @Column({ name: 'target_id', type: 'uuid', nullable: true }) targetId:
    | string
    | null;
  @Column({ name: 'request_id', type: 'uuid', nullable: true }) requestId:
    | string
    | null;
  @Column({ name: 'operation_id', type: 'uuid' }) operationId: string;
  @Column({ name: 'reason_code', type: 'varchar', length: 64, nullable: true })
  reasonCode: string | null;
  @Column({ type: 'jsonb', default: () => "'{}'" }) changes: Record<
    string,
    unknown
  >;
  @Column({ type: 'jsonb', default: () => "'{}'" }) metadata: Record<
    string,
    unknown
  >;
}
