import { ApiProperty } from '@nestjs/swagger';
import { DepartementView } from 'src/application/departement/views/departement.view';

type Departement = Omit<
  DepartementView,
  'departements' | 'createdAt' | 'updatedAt'
>;

export class RegionView {
  @ApiProperty({ example: '5d33fedc-7a06-48a4-b53d-05bf2da446dc' })
  public id: string;

  @ApiProperty({ example: 'Bretagne' })
  public name: string;

  @ApiProperty()
  public departements: Departement[];

  @ApiProperty({ required: false })
  public createdAt?: Date;

  @ApiProperty({ required: false })
  public updatedAt?: Date;

  constructor(
    id: string,
    name: string,
    departements: Departement[],
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
