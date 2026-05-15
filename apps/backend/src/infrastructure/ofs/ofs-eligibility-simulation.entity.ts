import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { EligibilitySimulationEntity } from '../eligibility-simulation/eligibility-simulation.entity';
import { OfsEntity } from './ofs.entity';

export enum OfsEligibilitySimulationAction {
  RECONTACTED = 'RECONTACTED',
  NOT_RECONTACTED = 'NOT_RECONTACTED',
}

export enum OfsEligibilitySimulationStatus {
  NOT_INTERESTED = 'NOT_INTERESTED',
  NO_RESPONSE = 'NO_RESPONSE',
  EXCHANGE_IN_PROGRESS = 'EXCHANGE_IN_PROGRESS',
  NOT_FINANCEABLE = 'NOT_FINANCEABLE',
  WAITING_FOR_LOAN = 'WAITING_FOR_LOAN',
  HAS_SIGNED_BRS = 'HAS_SIGNED_BRS',
}

@Entity('ofs_eligibility_simulation')
@Unique('UQ_ofs_eligibility_simulation_ofs_simulation', [
  'ofsId',
  'eligibilitySimulationId',
])
export class OfsEligibilitySimulationEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'uuid' })
  public ofsId: string;

  @Column({ type: 'uuid' })
  public eligibilitySimulationId: string;

  @ManyToOne(() => OfsEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ofsId' })
  public ofs: OfsEntity;

  @ManyToOne(() => EligibilitySimulationEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'eligibilitySimulationId' })
  public eligibilitySimulation: EligibilitySimulationEntity;

  @Column({
    type: 'enum',
    enum: OfsEligibilitySimulationAction,
    nullable: true,
  })
  public action: OfsEligibilitySimulationAction | null;

  @Column({
    type: 'enum',
    enum: OfsEligibilitySimulationStatus,
    nullable: true,
  })
  public status: OfsEligibilitySimulationStatus | null;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
