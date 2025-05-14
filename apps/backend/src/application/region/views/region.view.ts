import { ApiProperty } from '@nestjs/swagger';

export class RegionView {
  @ApiProperty({ example: '5d33fedc-7a06-48a4-b53d-05bf2da446dc' })
  public id: string;

  @ApiProperty({ example: 'Bretagne' })
  public name: string;
}
