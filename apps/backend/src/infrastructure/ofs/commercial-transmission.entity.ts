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
import { DistributorEntity } from '../distributor/distributor.entity';
import { OfsEntity } from './ofs.entity';

export enum CommercialTransmissionScopeType {
  ALL = 'ALL',
  GEOGRAPHIC = 'GEOGRAPHIC',
}

@Entity('commercial_transmission')
@Unique('UQ_commercial_transmission_ofs_distributor', [
  'ofsId',
  'distributorId',
])
export class CommercialTransmissionEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'uuid' })
  public ofsId: string;

  @Column({ type: 'uuid' })
  public distributorId: string;

  @ManyToOne(() => OfsEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ofsId' })
  public ofs: OfsEntity;

  @ManyToOne(() => DistributorEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'distributorId' })
  public distributor: DistributorEntity;

  @Column({ type: 'boolean', nullable: false, default: true })
  public isActive: boolean;

  @Column({
    type: 'enum',
    enum: CommercialTransmissionScopeType,
    nullable: false,
    default: CommercialTransmissionScopeType.ALL,
  })
  public scopeType: CommercialTransmissionScopeType;

  @Column({ type: 'varchar', array: true, nullable: false, default: [] })
  public inseeCodes: string[];

  @Column({ type: 'varchar', array: true, nullable: false, default: [] })
  public departementCodes: string[];

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
