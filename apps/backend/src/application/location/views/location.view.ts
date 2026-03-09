import { ApiProperty } from '@nestjs/swagger';
import { DepartementView } from 'src/application/departement/views/departement.view';

export class LocationView {
  @ApiProperty({ example: '5d33fedc-7a06-48a4-b53d-05bf2da446dc' })
  public id: string;

  @ApiProperty({ example: 48.3905 })
  public latitude: number;

  @ApiProperty({ example: -4.486 })
  public longitude: number;

  @ApiProperty({ example: 'Brest' })
  public city: string;

  @ApiProperty({ example: '29019' })
  public citycode: string;

  @ApiProperty({ example: 'Brest' })
  public label: string;

  @ApiProperty({ example: 'Brest' })
  public municipality: string;

  @ApiProperty({ example: '29200' })
  public postalCode: string;

  @ApiProperty({ type: DepartementView })
  public departement: DepartementView;

  constructor(
    id: string,
    latitude: number,
    longitude: number,
    city: string,
    citycode: string,
    label: string,
    municipality: string,
    postalCode: string,
    departement: DepartementView,
  ) {
    this.id = id;
    this.latitude = latitude;
    this.longitude = longitude;
    this.city = city;
    this.citycode = citycode;
    this.label = label;
    this.municipality = municipality;
    this.postalCode = postalCode;
    this.departement = departement;
  }
}
