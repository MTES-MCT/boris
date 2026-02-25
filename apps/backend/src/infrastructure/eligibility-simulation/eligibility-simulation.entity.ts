import {
  DeclarationType,
  EligibilityCategory,
  EligibilitySimulationInterface,
  PropertySituation,
  HousingType,
  EmploymentStatus,
  PositionType,
  ContractType,
} from 'src/domain/eligibility-simulation/eligibility-simulation.interface';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LocationEntity } from '../location/location.entity';

@Entity('eligibility_simulation')
export class EligibilitySimulationEntity
  implements EligibilitySimulationInterface
{
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'int', nullable: true })
  public householdSize?: number;

  @Column({ type: 'boolean', nullable: true })
  public hasDisability?: boolean;

  @Column({
    type: 'enum',
    enum: [
      'LOCATAIRE_SOCIAL',
      'LOCATAIRE_PRIVE',
      'PROPRIETAIRE',
      'HEBERGE',
      'AUTRE',
    ],
    nullable: true,
  })
  public propertySituation?: PropertySituation;

  @Column({ type: 'int', nullable: true })
  public dependantsAmount?: number;

  @Column({ type: 'date', nullable: true })
  public birthday?: Date;

  @Column({ type: 'date', nullable: true })
  public coBuyerBirthday?: Date;

  @Column({ type: 'int', nullable: true })
  public taxableIncome?: number;

  @Column({
    type: 'enum',
    enum: ['SEUL_SOUHAIT_SEUL', 'SEUL_SOUHAIT_PARTENAIRE', 'COMMUN'],
    nullable: true,
  })
  public declarationType?: DeclarationType;

  @Column({ type: 'int', nullable: true })
  public firstCoBuyerFormattedTaxableIncome?: number;

  @Column({ type: 'int', nullable: true })
  public secondCoBuyerFormattedTaxableIncome?: number;

  @Column({ type: 'json', nullable: true })
  public eligibility?: EligibilityCategory;

  @Column({ type: 'varchar', nullable: true })
  public firstName?: string;

  @Column({ type: 'varchar', nullable: true })
  public lastName?: string;

  @Column({ type: 'varchar', nullable: true })
  public email?: string;

  @Column({ type: 'varchar', nullable: true })
  public phone?: string;

  @Column({ type: 'boolean', nullable: true })
  public hasRefusedConnection?: boolean;

  @Column({
    type: 'enum',
    enum: ['T1', 'T2', 'T3', 'T4', 'T5'],
    nullable: true,
  })
  public housingType?: HousingType;

  @Column({ type: 'int', nullable: true })
  public contribution?: number;

  @Column({ type: 'int', nullable: true })
  public resources?: number;

  @Column({ type: 'boolean', nullable: true })
  public hadBrsKnowledge?: boolean;

  @Column({
    type: 'enum',
    enum: [
      'SALARIE_PRIVE_NON_AGRICOLE',
      'SALARIE_AGRICOLE',
      'SALARIE_PUBLIC_OU_FONCTIONNAIRE',
      'INDEPENDANT',
      'SALARIE_GROUPE_LA_POSTE',
      'SANS_ACTIVITE_PROFESSIONNELLE',
      'RETRAITE',
    ],
    nullable: true,
  })
  public employmentStatus?: EmploymentStatus;

  @Column({ type: 'varchar', nullable: true })
  public laposteEmployer?: string;

  @Column({ type: 'boolean', nullable: true })
  public canSendInformationsToLaposte?: boolean;

  @Column({
    type: 'enum',
    enum: ['CADRE', 'NON_CADRE', 'NO_CATEGORIE_PROFESSIONNELLE'],
    nullable: true,
  })
  public positionType?: PositionType;

  @Column({ type: 'boolean', nullable: true })
  public positionStage?: boolean;

  @Column({ type: 'boolean', nullable: true })
  public hasCompanyMoreThan10Employees?: boolean;

  @Column({ type: 'boolean', nullable: true })
  public hasCompanyMoreThan50Employees?: boolean;

  @Column({ type: 'boolean', nullable: true })
  public allowFinancingAndOwnershipAdvices?: boolean;

  @Column({ type: 'enum', enum: ['CDI', 'CDD'], nullable: true })
  public positionContractType?: ContractType;

  @OneToMany(() => LocationEntity, (location) => location.eligibilitySimulation)
  public locations: LocationEntity[];

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
