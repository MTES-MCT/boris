import { ApiProperty } from '@nestjs/swagger';
import { MinimalRegionView } from 'src/application/region/views/minimal.view';

export class DepartementView {
  @ApiProperty({ example: '5d33fedc-7a06-48a4-b53d-05bf2da446dc' })
  public id: string;

  @ApiProperty({ example: 'Finistère' })
  public name: string;

  @ApiProperty({ example: '29' })
  public code: string;

  @ApiProperty({ type: () => MinimalRegionView })
  public region: MinimalRegionView;

  @ApiProperty({ required: false })
  public createdAt?: Date;

  @ApiProperty({ required: false })
  public updatedAt?: Date;

  constructor(
    id: string,
    name: string,
    code: string,
    region: MinimalRegionView,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.region = region;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
