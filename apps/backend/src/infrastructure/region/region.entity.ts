import { RegionInterface } from 'src/domain/region/region.interface';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DepartementEntity } from '../departement/departement.entity';

@Entity('region')
export class RegionEntity implements RegionInterface {
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @Column({ type: 'varchar', nullable: false })
  public name: string;

  @OneToMany(() => DepartementEntity, (departement) => departement.region)
  public departements: DepartementEntity[] | undefined;

  constructor(name: string, departements?: DepartementEntity[]) {
    this.name = name;
    this.departements = departements;
  }
}
