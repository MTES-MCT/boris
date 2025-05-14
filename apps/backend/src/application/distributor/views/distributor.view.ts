import { ApiProperty } from '@nestjs/swagger';

export class DistributorView {
  @ApiProperty({ example: '5d33fedc-7a06-48a4-b53d-05bf2da446dc' })
  public id: string;

  @ApiProperty({ example: 'Commercialisateur du Finistère' })
  public name: string;

  @ApiProperty({ example: 'https://ofs-de-bretagne.fr' })
  public websiteUrl: string;
}
