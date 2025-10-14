import { OfsInterface } from 'src/domain/ofs/ofs.interface';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DepartementEntity } from 'src/infrastructure/departement/departement.entity';
import { RegionEntity } from '../region/region.entity';
import { DistributorEntity } from '../distributor/distributor.entity';

@Entity('ofs')
export class OfsEntity implements OfsInterface {
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @Column({ type: 'varchar' })
  public name: string;

  @Column({ type: 'varchar', nullable: true })
  public websiteUrl: string | null;

  @Column({ type: 'varchar', nullable: true })
  public phone: string | null;

  @Column({ type: 'varchar', nullable: true })
  public email: string | null;

  @Column({ type: 'boolean', nullable: false, default: false })
  public hasStartedPrograms: boolean;

  @ManyToMany(() => DepartementEntity, (departement) => departement.ofss)
  @JoinTable({
    name: 'ofs_departement',
  })
  public departements: DepartementEntity[];

  @ManyToMany(() => RegionEntity, (region) => region.ofss)
  @JoinTable({
    name: 'ofs_region',
  })
  public regions: RegionEntity[];

  @ManyToMany(() => DistributorEntity, (distributor) => distributor.ofss)
  @JoinTable({
    name: 'ofs_distributor',
  })
  public distributors: DistributorEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(
    name: string,
    phone: string | null,
    websiteUrl: string | null,
    email: string | null,
    departements: DepartementEntity[],
    regions: RegionEntity[],
    distributors: DistributorEntity[],
  ) {
    this.name = name;
    this.phone = phone;
    this.websiteUrl = websiteUrl;
    this.email = email;
    this.departements = departements;
    this.regions = regions;
    this.distributors = distributors;
  }
}
