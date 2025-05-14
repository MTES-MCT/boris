import { ApiProperty } from '@nestjs/swagger';
import { RegionRelationnalView } from 'src/application/region/views/relationnal.view';
import { DepartementRelationnalView } from 'src/application/departement/views/relationnal.view';
import { DistributorRelationnalView } from 'src/application/distributor/views/relationnal.view';

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

  @ApiProperty({
    type: /* istanbul ignore next */ () => [DepartementRelationnalView],
  })
  public departements: DepartementRelationnalView[];

  @ApiProperty({
    type: /* istanbul ignore next */ () => [RegionRelationnalView],
  })
  public regions: RegionRelationnalView[];

  @ApiProperty({
    type: /* istanbul ignore next */ () => [DistributorRelationnalView],
  })
  public distributors: DistributorRelationnalView[];

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
    departements: DepartementRelationnalView[],
    regions: RegionRelationnalView[],
    distributors: DistributorRelationnalView[],
  ) {
    this.id = id;
    this.name = name;
    this.websiteUrl = websiteUrl;
    this.phone = phone;
    this.email = email;
    this.departements = departements;
    this.regions = regions;
    this.distributors = distributors;
  }
}
