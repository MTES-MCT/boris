import { ApiProperty } from '@nestjs/swagger';
import { MinimalRegionView } from 'src/application/region/views/minimal.view';
import { MinimalDepartementView } from 'src/application/departement/views/minimal.view';
import { MinimalDistributorView } from 'src/application/distributor/views/minimal.view';

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

  @ApiProperty({ type: () => [MinimalDepartementView] })
  public departements: MinimalDepartementView[];

  @ApiProperty({ type: () => [MinimalRegionView] })
  public regions: MinimalRegionView[];

  @ApiProperty({ type: () => [MinimalDistributorView] })
  public distributors: MinimalDistributorView[];

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
    departements: MinimalDepartementView[],
    regions: MinimalRegionView[],
    distributors: MinimalDistributorView[],
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
