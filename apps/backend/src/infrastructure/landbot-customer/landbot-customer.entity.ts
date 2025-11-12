import {
  LandbotBrsKnowledge,
  LandbotCustomerInterface,
  LandbotEligibility,
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

  @Column({ type: 'date', nullable: false })
  public date: Date;

  @ManyToOne(
    () => DepartementEntity,
    (departement) => departement.landbotCustomers,
    { nullable: true },
  )
  public departement: DepartementEntity;

  @Column({ type: 'enum', enum: LandbotEligibility, nullable: true })
  public eligibility?: LandbotEligibility;

  @Column({ type: 'enum', enum: LandbotBrsKnowledge, nullable: true })
  public brsKnowledge?: LandbotBrsKnowledge;

  @Column({ type: 'enum', enum: LandbotRealEstateSituation, nullable: true })
  public realEstateSituation?: LandbotRealEstateSituation;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(
    date: Date,
    departement: DepartementEntity,
    eligibility?: LandbotEligibility,
    brsKnowledge?: LandbotBrsKnowledge,
    realEstateSituation?: LandbotRealEstateSituation,
  ) {
    this.date = date;
    this.departement = departement;
    this.eligibility = eligibility;
    this.brsKnowledge = brsKnowledge;
    this.realEstateSituation = realEstateSituation;
  }
}
