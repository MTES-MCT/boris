import { ApiProperty } from '@nestjs/swagger';
import { DepartementRelationnalView } from 'src/application/departement/views/relationnal.view';
import { BrsZone } from 'src/domain/brs-zone/brz-zone.type';

export class MunicipalityView {
  @ApiProperty({ example: '5d33fedc-7a06-48a4-b53d-05bf2da446dc' })
  public id: string;

  @ApiProperty({ example: 'Quimper' })
  public name: string;

  @ApiProperty({ example: '29232' })
  public inseeCode: string;

  @ApiProperty({ example: 'B1' })
  public zone: BrsZone;

  @ApiProperty({
    type: /* istanbul ignore next */ () => DepartementRelationnalView,
  })
  public departement: DepartementRelationnalView;

  constructor(
    id: string,
    name: string,
    code: string,
    zone: BrsZone,
    departement: DepartementRelationnalView,
  ) {
    this.id = id;
    this.name = name;
    this.inseeCode = code;
    this.zone = zone;
    this.departement = departement;
  }
}
