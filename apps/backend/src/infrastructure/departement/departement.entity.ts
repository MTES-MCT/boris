import { DepartementInterface } from 'src/domain/departement/departement.interface';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RegionEntity } from '../region/region.entity';

@Entity('departement')
export class DepartementEntity implements DepartementInterface {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', nullable: false })
  public name: string;

  @Column({ type: 'integer', nullable: false })
  public zipcode: number;

  @ManyToOne(() => RegionEntity, (region) => region.departements)
  region: RegionEntity;

  constructor(name: string, zipcode: number, region: RegionEntity) {
    this.name = name;
    this.zipcode = zipcode;
    this.region = region;
  }
}
