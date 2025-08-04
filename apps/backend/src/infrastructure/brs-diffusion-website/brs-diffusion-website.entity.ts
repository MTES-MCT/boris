import { BrsDiffusionWebsiteInterface } from 'src/domain/brs-diffusion-website/brs-diffusion-website.interface';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RegionEntity } from '../region/region.entity';
import { DepartementEntity } from '../departement/departement.entity';

@Entity('brs_diffusion_website')
export class BrsDiffusionWebsiteEntity implements BrsDiffusionWebsiteInterface {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', nullable: false })
  public source: string;

  @Column({ type: 'varchar', nullable: false })
  public distributorName: string;

  @Column({ type: 'varchar', nullable: false })
  public ofsName: string;

  @Column({ type: 'varchar', nullable: false })
  public city: string;

  @Column({ type: 'varchar', nullable: false })
  public zipcode: string;

  @Column({ type: 'varchar', nullable: false })
  public address: string;

  @Column({ type: 'varchar', nullable: false })
  public inseeCode: string;

  @Column({ type: 'float', nullable: false })
  public latitude: number;

  @Column({ type: 'float', nullable: false })
  public longitude: number;

  @ManyToOne(() => RegionEntity, (region) => region.brsDiffusionWebsites)
  public region: RegionEntity;

  @ManyToOne(
    () => DepartementEntity,
    (departement) => departement.brsDiffusionWebsites,
  )
  public departement: DepartementEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(
    source: string,
    distributorName: string,
    ofsName: string,
    city: string,
    zipcode: string,
    address: string,
    inseeCode: string,
    latitude: number,
    longitude: number,
    region: RegionEntity,
    departement: DepartementEntity,
  ) {
    this.source = source;
    this.distributorName = distributorName;
    this.ofsName = ofsName;
    this.city = city;
    this.zipcode = zipcode;
    this.address = address;
    this.inseeCode = inseeCode;
    this.latitude = latitude;
    this.longitude = longitude;
    this.region = region;
    this.departement = departement;
  }
}
