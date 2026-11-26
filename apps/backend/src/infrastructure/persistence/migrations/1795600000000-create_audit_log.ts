import { MigrationInterface, QueryRunner } from 'typeorm';
export class CreateAuditLog1795600000000 implements MigrationInterface {
  async up(runner: QueryRunner): Promise<void> {
    await runner.query(`CREATE TABLE audit_event (
  id uuid PRIMARY KEY,
  schema_version smallint NOT NULL DEFAULT 1,
  occurred_at timestamptz NOT NULL,
  recorded_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  event_type varchar(100) NOT NULL,
  outcome varchar(16) NOT NULL
    CHECK (outcome IN ('succeeded', 'failed', 'denied')),
  actor_kind varchar(16) NOT NULL
    CHECK (actor_kind IN ('user', 'anonymous', 'service', 'operator')),
  actor_id uuid,
  actor_ref varchar(200),
  actor_roles jsonb NOT NULL DEFAULT '[]',
  ofs_id uuid,
  distributor_id uuid,
  target_type varchar(64),
  target_id uuid,
  request_id uuid,
  operation_id uuid NOT NULL,
  reason_code varchar(64),
  changes jsonb NOT NULL DEFAULT '{}',
  metadata jsonb NOT NULL DEFAULT '{}',
  CHECK (jsonb_typeof(changes) = 'object'),
  CHECK (jsonb_typeof(metadata) = 'object'),
  CHECK (jsonb_typeof(actor_roles) = 'array'),
  CHECK (octet_length(changes::text) <= 32768),
  CHECK (octet_length(metadata::text) <= 32768)
);

CREATE TABLE audit_event_resource (
  event_id uuid NOT NULL REFERENCES audit_event(id) ON DELETE CASCADE,
  ordinal integer NOT NULL CHECK (ordinal >= 0),
  resource_type varchar(64) NOT NULL,
  resource_id uuid NOT NULL,
  simulation_id uuid,
  ofs_id uuid,
  distributor_id uuid,
  PRIMARY KEY (event_id, ordinal)
);
CREATE INDEX audit_event_actor_idx ON audit_event (actor_id, occurred_at DESC, id);
CREATE INDEX audit_event_target_idx ON audit_event (target_type, target_id, occurred_at DESC, id);
CREATE INDEX audit_event_ofs_idx ON audit_event (ofs_id, occurred_at DESC, id);
CREATE INDEX audit_event_distributor_idx ON audit_event (distributor_id, occurred_at DESC, id);
CREATE INDEX audit_event_type_idx ON audit_event (event_type, occurred_at DESC, id);
CREATE INDEX audit_event_operation_idx ON audit_event (operation_id);
CREATE INDEX audit_resource_lookup_idx ON audit_event_resource (resource_type, resource_id, event_id);
`);
  }
  async down(runner: QueryRunner): Promise<void> {
    await runner.query(
      'DROP TABLE audit_event_resource; DROP TABLE audit_event',
    );
  }
}
