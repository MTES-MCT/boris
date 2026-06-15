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
import {
  OfsEligibilitySimulationAction,
  OfsEligibilitySimulationStatus,
} from './ofs-eligibility-simulation.entity';
import { DistributorEntity } from '../distributor/distributor.entity';
import { EligibilitySimulationEntity } from '../eligibility-simulation/eligibility-simulation.entity';

@Entity('distributor_eligibility_simulation')
@Unique('UQ_distributor_eligibility_simulation_distributor_simulation', [
  'distributorId',
  'eligibilitySimulationId',
])
export class DistributorEligibilitySimulationEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'uuid' })
  public distributorId: string;

  @Column({ type: 'uuid' })
  public eligibilitySimulationId: string;

  @ManyToOne(() => DistributorEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'distributorId' })
  public distributor: DistributorEntity;

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
