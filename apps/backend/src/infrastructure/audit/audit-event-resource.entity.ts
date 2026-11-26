import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { AuditEventEntity } from './audit-event.entity';
@Entity('audit_event_resource')
export class AuditEventResourceEntity {
  @PrimaryColumn({ name: 'event_id', type: 'uuid' }) eventId: string;
  @PrimaryColumn('integer') ordinal: number;
  @ManyToOne(() => AuditEventEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'event_id' })
  event: AuditEventEntity;
  @Column({ name: 'resource_type', type: 'varchar', length: 64 })
  resourceType: string;
  @Column({ name: 'resource_id', type: 'uuid' }) resourceId: string;
  @Column({ name: 'simulation_id', type: 'uuid', nullable: true })
  simulationId: string | null;
  @Column({ name: 'ofs_id', type: 'uuid', nullable: true }) ofsId:
    | string
    | null;
  @Column({ name: 'distributor_id', type: 'uuid', nullable: true })
  distributorId: string | null;
}
