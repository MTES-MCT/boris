import { OfsInterface } from 'src/domain/ofs/ofs.interface';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DistributorInterface } from 'src/domain/distributor/distributor.interface';
import { OfsEntity } from '../ofs/ofs.entity';

@Entity('distributor')
export class DistributorEntity implements DistributorInterface {
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @Column({ type: 'varchar', nullable: false })
  public name: string;

  @Column({ type: 'varchar' })
  public websiteUrl: string;

  @ManyToMany(() => OfsEntity, (ofs) => ofs.distributors)
  public ofss: OfsInterface[];

  constructor(name: string, websiteUrl: string, ofss: OfsInterface[]) {
    this.name = name;
    this.websiteUrl = websiteUrl;
    this.ofss = ofss;
  }
}
