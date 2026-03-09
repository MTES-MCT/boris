import { LocationInterface } from 'src/domain/location/location.interface';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DepartementEntity } from '../departement/departement.entity';
import { EligibilitySimulationEntity } from '../eligibility-simulation/eligibility-simulation.entity';

@Entity('location')
export class LocationEntity implements LocationInterface {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'float', nullable: true })
  public latitude: number;

  @Column({ type: 'float', nullable: true })
  public longitude: number;

  @Column({ type: 'varchar', nullable: true })
  public city: string;

  @Column({ type: 'varchar', nullable: true })
  public citycode: string;

  @Column({ type: 'varchar', nullable: true })
  public label: string;

  @Column({ type: 'varchar', nullable: true })
  public municipality: string;

  @Column({ type: 'varchar', nullable: true })
  public postalCode: string;

  @ManyToOne(() => DepartementEntity, (departement) => departement.locations)
  public departement: DepartementEntity;

  @ManyToOne(
    () => EligibilitySimulationEntity,
    (eligibilitySimulation) => eligibilitySimulation.locations,
  )
  public eligibilitySimulation: EligibilitySimulationEntity;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
