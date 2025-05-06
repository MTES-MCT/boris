import { OfsInterface } from 'src/domain/ofs/ofs.interface';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DepartementEntity } from 'src/infrastructure/departement/departement.entity';
import { RegionEntity } from '../region/region.entity';

@Entity('ofs')
export class OfsEntity implements OfsInterface {
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @Column({ type: 'varchar', nullable: false })
  public name: string;

  @Column({ type: 'varchar' })
  public phone: string;

  @Column({ type: 'varchar' })
  public websiteUrl: string;

  @ManyToMany(() => DepartementEntity)
  @JoinTable({
    name: 'ofs_departement',
  })
  public departements: DepartementEntity[] | undefined;

  @ManyToMany(() => RegionEntity)
  @JoinTable({
    name: 'ofs_region',
  })
  public regions: RegionEntity[] | undefined;

  constructor(
    name: string,
    phone: string,
    websiteUrl: string,
    departements?: DepartementEntity[],
    regions?: RegionEntity[],
  ) {
    this.name = name;
    this.phone = phone;
    this.websiteUrl = websiteUrl;
    this.departements = departements;
    this.regions = regions;
  }
}
