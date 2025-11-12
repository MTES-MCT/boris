import { DepartementInterface } from 'src/domain/departement/departement.interface';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RegionEntity } from 'src/infrastructure/region/region.entity';
import { OfsEntity } from '../ofs/ofs.entity';
import { BrsDiffusionWebsiteEntity } from '../brs-diffusion-website/brs-diffusion-website.entity';
import { MunicipalityEntity } from '../municipality/municipality.entity';
import { LandbotCustomerEntity } from '../landbot-customer/landbot-customer.entity';

@Entity('departement')
export class DepartementEntity implements DepartementInterface {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', nullable: false })
  public name: string;

  @Column({ type: 'varchar', nullable: false })
  public code: string;

  @ManyToOne(() => RegionEntity, (region) => region.departements)
  public region: RegionEntity;

  @OneToMany(
    () => MunicipalityEntity,
    (municipality) => municipality.departement,
    {
      cascade: true,
    },
  )
  public municipalities: MunicipalityEntity[];

  @ManyToMany(() => OfsEntity, (ofs) => ofs.departements)
  public ofss: OfsEntity[];

  @OneToMany(
    () => BrsDiffusionWebsiteEntity,
    (brsDiffusionWebsite) => brsDiffusionWebsite.departement,
    { cascade: true },
  )
  public brsDiffusionWebsites: BrsDiffusionWebsiteEntity[];

  @OneToMany(
    () => LandbotCustomerEntity,
    (landbotCustomer) => landbotCustomer.departement,
    { cascade: true },
  )
  public landbotCustomers: LandbotCustomerEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(name: string, code: string, region: RegionEntity) {
    this.name = name;
    this.code = code;
    this.region = region;
  }
}
