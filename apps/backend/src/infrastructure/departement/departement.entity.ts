import { DepartementInterface } from 'src/domain/departement/departement.interface';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RegionEntity } from 'src/infrastructure/region/region.entity';

@Entity('departement')
export class DepartementEntity implements DepartementInterface {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', nullable: false })
  public name: string;

  @Column({ type: 'varchar', nullable: false })
  public code: string;

  @ManyToOne(() => RegionEntity, (region) => region.departements)
  region: RegionEntity | undefined;

  constructor(name: string, code: string, region?: RegionEntity) {
    this.name = name;
    this.code = code;
    this.region = region;
  }
}
