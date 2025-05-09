import { OfsInterface } from 'src/domain/ofs/ofs.interface';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DistributorInterface } from 'src/domain/distributor/distributor.interface';
import { OfsEntity } from '../ofs/ofs.entity';

@Entity('distributor')
export class DistributorEntity implements DistributorInterface {
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @Column({ type: 'varchar' })
  public name: string;

  @Column({ type: 'varchar' })
  public websiteUrl: string;

  @ManyToMany(() => OfsEntity, (ofs) => ofs.distributors)
  public ofss: OfsInterface[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(name: string, websiteUrl: string, ofss: OfsInterface[]) {
    this.name = name;
    this.websiteUrl = websiteUrl;
    this.ofss = ofss;
  }
}
