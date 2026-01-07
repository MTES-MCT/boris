import {
  LandbotBrsKnowledge,
  LandbotConnectionWish,
  LandbotCustomerInterface,
  LandbotDeclarationType,
  LandbotEligibility,
  LandbotDisability,
  LandbotRealEstateSituation,
} from 'src/domain/landbot-customer/landbot-customer.interface';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DepartementEntity } from '../departement/departement.entity';

@Entity('landbot_customer')
export class LandbotCustomerEntity implements LandbotCustomerInterface {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'timestamptz', nullable: false })
  public date: Date;

  @Column({ type: 'varchar', nullable: true })
  public desiredCity?: string;

  @ManyToOne(
    () => DepartementEntity,
    (departement) => departement.landbotCustomers,
    { nullable: true },
  )
  public departement?: DepartementEntity;

  @Column({ type: 'enum', enum: LandbotEligibility, nullable: true })
  public eligibility?: LandbotEligibility;

  @Column({ type: 'enum', enum: LandbotBrsKnowledge, nullable: true })
  public brsKnowledge?: LandbotBrsKnowledge;

  @Column({ type: 'enum', enum: LandbotRealEstateSituation, nullable: true })
  public realEstateSituation?: LandbotRealEstateSituation;

  @Column({ type: 'enum', enum: LandbotDisability, nullable: true })
  public disability?: LandbotDisability;

  @Column({ type: 'enum', enum: LandbotDeclarationType, nullable: true })
  public declarationType?: LandbotDeclarationType;

  @Column({ type: 'enum', enum: LandbotConnectionWish, nullable: true })
  public connectionWish?: LandbotConnectionWish;

  @Column({ type: 'int', nullable: true })
  public resources?: number;

  @Column({ type: 'boolean', default: false })
  public hasProvidedEmail?: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(
    date: Date,
    desiredCity?: string,
    departement?: DepartementEntity,
    eligibility?: LandbotEligibility,
    brsKnowledge?: LandbotBrsKnowledge,
    realEstateSituation?: LandbotRealEstateSituation,
    disability?: LandbotDisability,
    declarationType?: LandbotDeclarationType,
    connectionWish?: LandbotConnectionWish,
    resources?: number,
    hasProvidedEmail?: boolean,
  ) {
    this.date = date;
    this.desiredCity = desiredCity;
    this.departement = departement;
    this.eligibility = eligibility;
    this.brsKnowledge = brsKnowledge;
    this.realEstateSituation = realEstateSituation;
    this.disability = disability;
    this.declarationType = declarationType;
    this.connectionWish = connectionWish;
    this.resources = resources;
    this.hasProvidedEmail = hasProvidedEmail;
  }
}
