import { DepartementInterface } from 'src/domain/departement/departement.interface';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RegionEntity } from 'src/infrastructure/region/region.entity';
import { OfsEntity } from '../ofs/ofs.entity';

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

  @ManyToMany(() => OfsEntity, (ofs) => ofs.departements)
  public ofss: OfsEntity[];

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
