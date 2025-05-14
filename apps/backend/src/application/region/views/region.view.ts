import { ApiProperty } from '@nestjs/swagger';
import { MinimalDepartementView } from 'src/application/departement/views/minimal.view';

export class RegionView {
  @ApiProperty({ example: '5d33fedc-7a06-48a4-b53d-05bf2da446dc' })
  public id: string;

  @ApiProperty({ example: 'Bretagne' })
  public name: string;

  @ApiProperty({ type: () => [MinimalDepartementView] })
  public departements: MinimalDepartementView[];

  @ApiProperty({ required: false })
  public createdAt?: Date;

  @ApiProperty({ required: false })
  public updatedAt?: Date;

  constructor(
    id: string,
    name: string,
    departements: MinimalDepartementView[],
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id;
    this.name = name;
    this.departements = departements;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
