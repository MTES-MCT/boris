import { ApiProperty } from '@nestjs/swagger';
import { DepartementRelationnalView } from 'src/application/departement/views/relationnal.view';
import { RegionRelationnalView } from 'src/application/region/views/relationnal.view';

export class BrsDiffusionWebsiteView {
  @ApiProperty({ example: '5d33fedc-7a06-48a4-b53d-05bf2da446dc' })
  public id: string;

  @ApiProperty({ example: 'https://source.fr' })
  public source: string;

  @ApiProperty({ example: 'Commercialisateur du Finistère' })
  public distributorName: string;

  @ApiProperty({ example: "Nom de l'OFS" })
  public ofsName: string;

  @ApiProperty({ example: 'Quimper' })
  public city: string;

  @ApiProperty({ example: '29000' })
  public zipcode: string;

  @ApiProperty({ example: '29, Finistère, Bretagne' })
  public address: string;

  @ApiProperty({ example: '29000' })
  public inseeCode: string;

  @ApiProperty({ example: 48.111111 })
  public latitude: number;

  @ApiProperty({ example: 4.111111 })
  public longitude: number;

  @ApiProperty({
    type: /* istanbul ignore next */ () => RegionRelationnalView,
  })
  public region: RegionRelationnalView;

  @ApiProperty({
    type: /* istanbul ignore next */ () => DepartementRelationnalView,
  })
  public departement: DepartementRelationnalView;

  constructor(
    id: string,
    source: string,
    distributorName: string,
    ofsName: string,
    city: string,
    zipcode: string,
    address: string,
    inseeCode: string,
    latitude: number,
    longitude: number,
    region: RegionRelationnalView,
    departement: DepartementRelationnalView,
  ) {
    this.id = id;
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
