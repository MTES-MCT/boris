import { ApiProperty } from '@nestjs/swagger';
import { OfsView } from './ofs.view';

export class FindMyOfsProgramView {
  @ApiProperty({ example: 'Les Jardins du centre' })
  public name: string;

  @ApiProperty({ example: '12 rue de la Paix' })
  public address: string;

  @ApiProperty({ example: 'Nantes' })
  public city: string;

  @ApiProperty({ example: '44000' })
  public zipcode: string;

  @ApiProperty({ example: '03/2024' })
  public deliveryMonth: string | null;

  constructor(
    name: string,
    address: string,
    city: string,
    zipcode: string,
    deliveryMonth: string | null,
  ) {
    this.name = name;
    this.address = address;
    this.city = city;
    this.zipcode = zipcode;
    this.deliveryMonth = deliveryMonth;
  }
}

export class FindMyOfsResultView {
  @ApiProperty({ type: /* istanbul ignore next */ () => OfsView })
  public ofs: OfsView;

  @ApiProperty({ example: 1200, description: 'Distance en mètres' })
  public distance: number;

  @ApiProperty({ type: /* istanbul ignore next */ () => FindMyOfsProgramView })
  public nearestProgram: FindMyOfsProgramView;

  @ApiProperty({
    type: /* istanbul ignore next */ () => [FindMyOfsProgramView],
  })
  public programs: FindMyOfsProgramView[];

  constructor(
    ofs: OfsView,
    distance: number,
    nearestProgram: FindMyOfsProgramView,
    programs: FindMyOfsProgramView[],
  ) {
    this.ofs = ofs;
    this.distance = distance;
    this.nearestProgram = nearestProgram;
    this.programs = programs;
  }
}
