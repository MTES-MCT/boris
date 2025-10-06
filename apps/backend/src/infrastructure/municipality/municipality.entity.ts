import { MunicipalityInterface } from 'src/domain/municipality/municipality.interface';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BrsZone } from 'src/domain/brs-zone/brz-zone.type';
import { DepartementEntity } from '../departement/departement.entity';

@Entity('municipality')
export class MunicipalityEntity implements MunicipalityInterface {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', nullable: false })
  public name: string;

  @Column({ type: 'varchar', nullable: false })
  public inseeCode: string;

  @Column({
    type: 'enum',
    enum: ['A', 'Abis', 'B1', 'B2', 'C'],
    nullable: false,
  })
  public zone: BrsZone;

  @ManyToOne(
    () => DepartementEntity,
    (departement) => departement.municipalities,
  )
  public departement: DepartementEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(
    name: string,
    inseeCode: string,
    zone: BrsZone,
    departement: DepartementEntity,
  ) {
    this.name = name;
    this.inseeCode = inseeCode;
    this.zone = zone;
    this.departement = departement;
  }
}
