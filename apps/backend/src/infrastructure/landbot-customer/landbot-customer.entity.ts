import {
  LandbotBrsKnowledge,
  LandbotCustomerInterface,
  LandbotDeclarationSeulCommun,
  LandbotEligibility,
  LandbotHandicap,
  LandbotMiseEnRelation,
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

  @Column({ type: 'enum', enum: LandbotHandicap, nullable: true })
  public handicap?: LandbotHandicap;

  @Column({ type: 'enum', enum: LandbotDeclarationSeulCommun, nullable: true })
  public declaration_seul_en_commun?: LandbotDeclarationSeulCommun;

  @Column({ type: 'enum', enum: LandbotMiseEnRelation, nullable: true })
  public miseenrelation_yesno?: LandbotMiseEnRelation;

  @Column({ type: 'int', nullable: true })
  public ressources?: number;

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
  ) {
    this.date = date;
    this.desiredCity = desiredCity;
    this.departement = departement;
    this.eligibility = eligibility;
    this.brsKnowledge = brsKnowledge;
    this.realEstateSituation = realEstateSituation;
  }
}
