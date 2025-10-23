import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BrsZone } from 'src/domain/brs-zone/brz-zone.type';
import {
  AcquisitionSimulationInterface,
  CondominiumFeesFrequency,
  HousingType,
  PtzType,
} from 'src/domain/acquisition-simulation/acquisition-simulation.interface';

@Entity('acquisition_simulation')
export class AcquisitionSimulationEntity
  implements AcquisitionSimulationInterface
{
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'int', nullable: true })
  public housingPrice?: number;

  @Column({
    type: 'enum',
    enum: ['A', 'Abis', 'B1', 'B2', 'C'],
    nullable: true,
  })
  public brsZone?: BrsZone;

  @Column({ type: 'int', nullable: true })
  public surface?: number;

  @Column({ type: 'enum', enum: ['new', 'old'], nullable: true })
  public housingType?: HousingType;

  @Column({ type: 'int', nullable: true })
  public ownContribution?: number;

  @Column({ type: 'int', nullable: true })
  public notaryFees?: number;

  @Column({ type: 'int', nullable: true })
  public oneTimeExpenses?: number;

  @Column({ type: 'float', nullable: true })
  public interestRate?: number;

  @Column({ type: 'int', nullable: true })
  public loanDuration?: number;

  @Column({ type: 'int', nullable: true })
  inHousePeopleAmount?: number;

  @Column({ type: 'int', nullable: true })
  public fiscalIncome?: number;

  @Column({ type: 'enum', enum: ['collectif', 'individuel'], nullable: true })
  public ptzType?: PtzType;

  @Column({ type: 'int', nullable: true })
  public brsFees?: number;

  @Column({ type: 'int', nullable: true })
  public yearlyPropertyTax?: number;

  @Column({ type: 'int', nullable: true })
  public yearlyHouseingInsurance?: number;

  @Column({
    type: 'enum',
    enum: ['yearly', 'monthly', 'trimestrial'],
    nullable: true,
  })
  public condominiumFeesFrequency?: CondominiumFeesFrequency;

  @Column({ type: 'int', nullable: true })
  public condominiumFees?: number;

  @Column({ type: 'int', nullable: true })
  public monthlyExpenses?: number;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(
    housingPrice?: number,
    brsZone?: BrsZone,
    surface?: number,
    housingType?: HousingType,
  ) {
    this.housingPrice = housingPrice;
    this.brsZone = brsZone;
    this.surface = surface;
    this.housingType = housingType;
  }
}
