import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DepartementRelationnalView } from 'src/application/departement/views/relationnal.view';
import { RegionRelationnalView } from 'src/application/region/views/relationnal.view';
import { BrsHousingType } from 'src/domain/brs-diffusion-website/brs-diffusion-website.interface';

export class BrsDiffusionWebsiteOrganisationView {
  @ApiProperty({ example: '5d33fedc-7a06-48a4-b53d-05bf2da446dc' })
  public id: string;

  @ApiProperty({ example: 'OFS de Bretagne' })
  public name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

export class BrsDiffusionWebsiteView {
  @ApiProperty({ example: '5d33fedc-7a06-48a4-b53d-05bf2da446dc' })
  public id: string;

  @ApiProperty({ example: 'https://source.fr' })
  public source: string;

  @ApiPropertyOptional({
    example: 'Commercialisateur du Finistère',
    nullable: true,
  })
  public distributorName: string | null;

  @ApiPropertyOptional({ example: "Nom de l'OFS", nullable: true })
  public ofsName: string | null;

  @ApiPropertyOptional({ example: 'Les Jardins de Boris', nullable: true })
  public programName: string | null;

  @ApiProperty({ example: 'Quimper' })
  public city: string;

  @ApiProperty({ example: '29000' })
  public zipcode: string;

  @ApiProperty({ example: '29, Finistère, Bretagne' })
  public address: string;

  @ApiProperty({ example: '29000' })
  public inseeCode: string;

  @ApiPropertyOptional({ example: '2027-03', nullable: true })
  public deliveryMonth: string | null;

  @ApiProperty({ example: 48.111111 })
  public latitude: number;

  @ApiProperty({ example: 4.111111 })
  public longitude: number;

  @ApiPropertyOptional({ example: 100, description: 'Distance en kilomètres' })
  public distance?: number;

  @ApiProperty({
    type: /* istanbul ignore next */ () => RegionRelationnalView,
  })
  public region: RegionRelationnalView;

  @ApiProperty({
    type: /* istanbul ignore next */ () => DepartementRelationnalView,
  })
  public departement: DepartementRelationnalView;

  @ApiPropertyOptional({
    type: /* istanbul ignore next */ () => BrsDiffusionWebsiteOrganisationView,
    nullable: true,
  })
  public ofs: BrsDiffusionWebsiteOrganisationView | null;

  @ApiPropertyOptional({
    type: /* istanbul ignore next */ () => BrsDiffusionWebsiteOrganisationView,
    nullable: true,
  })
  public distributor: BrsDiffusionWebsiteOrganisationView | null;

  @ApiProperty({ enum: ['new', 'old'], example: 'new' })
  public housingType: BrsHousingType;

  constructor(
    id: string,
    source: string,
    distributorName: string | null,
    ofsName: string | null,
    city: string,
    zipcode: string,
    address: string,
    inseeCode: string,
    latitude: number,
    longitude: number,
    region: RegionRelationnalView,
    departement: DepartementRelationnalView,
    distance?: number,
    programName: string | null = null,
    deliveryMonth: string | null = null,
    ofs: BrsDiffusionWebsiteOrganisationView | null = null,
    distributor: BrsDiffusionWebsiteOrganisationView | null = null,
    housingType: BrsHousingType = 'new',
  ) {
    this.id = id;
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
    this.distance = distance;
  }
}
