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

  @Column({ type: 'float' })
  public latitude: number;

  @Column({ type: 'float' })
  public longitude: number;

  @Column({ type: 'varchar' })
  public city: string;

  @Column({ type: 'varchar' })
  public citycode: string;

  @Column({ type: 'varchar' })
  public label: string;

  @Column({ type: 'varchar' })
  public municipality: string;

  @Column({ type: 'varchar' })
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
