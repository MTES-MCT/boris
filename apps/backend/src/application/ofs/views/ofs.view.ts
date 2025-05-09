import { ApiProperty } from '@nestjs/swagger';
import { DepartementView } from 'src/application/departement/views/departement.view';
import { DistributorView } from 'src/application/distributor/views/distributor.view';
import { RegionView } from 'src/application/region/views/region.view';

type Departement = Omit<DepartementView, 'region' | 'createdAt' | 'updatedAt'>;
type Region = Omit<RegionView, 'departements' | 'createdAt' | 'updatedAt'>;
type Distributor = Omit<DistributorView, 'ofss' | 'createdAt' | 'updatedAt'>;

export class OfsView {
  @ApiProperty({ example: '5d33fedc-7a06-48a4-b53d-05bf2da446dc' })
  public id: string;

  @ApiProperty({ example: 'OFS de Bretagne' })
  public name: string;

  @ApiProperty({ example: 'https://ofs-de-bretagne.fr' })
  public websiteUrl: string | null;

  @ApiProperty({ example: '01 02 03 04 05' })
  public phone: string | null;

  @ApiProperty({ example: 'contact@ofs-de-bretagne.fr' })
  public email: string | null;

  @ApiProperty()
  public departements: Departement[];

  @ApiProperty()
  public regions: Region[];

  @ApiProperty()
  public distributors: Distributor[];

  @ApiProperty({ required: false })
  public createdAt?: Date;

  @ApiProperty({ required: false })
  public updatedAt?: Date;

  constructor(
    id: string,
    name: string,
    websiteUrl: string | null,
    phone: string | null,
    email: string | null,
    departements: Departement[],
    regions: Region[],
    distributors: Distributor[],
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id;
    this.name = name;
    this.websiteUrl = websiteUrl;
    this.phone = phone;
    this.email = email;
    this.departements = departements;
    this.regions = regions;
    this.distributors = distributors;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
