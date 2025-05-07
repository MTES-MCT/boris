import { RegionInterface } from 'src/domain/region/region.interface';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DepartementEntity } from 'src/infrastructure/departement/departement.entity';
import { OfsEntity } from '../ofs/ofs.entity';

@Entity('region')
export class RegionEntity implements RegionInterface {
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @Column({ type: 'varchar', nullable: false })
  public name: string;

  @OneToMany(() => DepartementEntity, (departement) => departement.region, {
    cascade: true,
  })
  public departements: DepartementEntity[];

  @ManyToMany(() => OfsEntity, (ofs) => ofs.regions)
  public ofss: OfsEntity[];

  constructor(name: string, departements: DepartementEntity[]) {
    this.name = name;
    this.departements = departements;
  }
}
