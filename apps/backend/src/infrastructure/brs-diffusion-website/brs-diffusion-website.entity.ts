import {
  BrsDiffusionWebsiteInterface,
  BrsHousingType,
} from 'src/domain/brs-diffusion-website/brs-diffusion-website.interface';
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
import { OfsEntity } from '../ofs/ofs.entity';
import { DistributorEntity } from '../distributor/distributor.entity';

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

  @Column({ type: 'varchar', nullable: true })
  public programName: string | null;

  @Column({ type: 'varchar', nullable: false })
  public city: string;

  @Column({ type: 'varchar', nullable: false })
  public zipcode: string;

  @Column({ type: 'varchar', nullable: false })
  public address: string;

  @Column({ type: 'varchar', nullable: false })
  public inseeCode: string;

  @Column({ type: 'varchar', nullable: true })
  public deliveryMonth: string | null;

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

  @ManyToOne(() => OfsEntity, { nullable: true })
  public ofs: OfsEntity | null;

  @ManyToOne(() => DistributorEntity, { nullable: true })
  public distributor: DistributorEntity | null;

  @Column({
    type: 'enum',
    enum: ['new', 'old'],
    nullable: false,
    default: 'new',
  })
  public housingType: BrsHousingType;

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
    ofs: OfsEntity | null = null,
    programName: string | null = null,
    deliveryMonth: string | null = null,
    distributor: DistributorEntity | null = null,
    housingType: BrsHousingType = 'new',
  ) {
    this.source = source;
    this.distributorName = distributorName;
    this.ofsName = ofsName;
    this.programName = programName;
    this.city = city;
    this.zipcode = zipcode;
    this.address = address;
    this.inseeCode = inseeCode;
    this.deliveryMonth = deliveryMonth;
    this.latitude = latitude;
    this.longitude = longitude;
    this.region = region;
    this.departement = departement;
    this.ofs = ofs;
    this.distributor = distributor;
    this.housingType = housingType;
  }
}

export type BrsDiffusionWebsiteEntityWithDistance =
  BrsDiffusionWebsiteEntity & {
    distance: number;
  };
