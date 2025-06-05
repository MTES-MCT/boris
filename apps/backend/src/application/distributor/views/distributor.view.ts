import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DistributorView {
  @ApiProperty({ example: '5d33fedc-7a06-48a4-b53d-05bf2da446dc' })
  public id: string;

  @ApiProperty({ example: 'Commercialisateur du Finistère' })
  public name: string;

  @ApiPropertyOptional({ example: 'https://ofs-de-bretagne.fr' })
  public websiteUrl?: string;

  constructor(id: string, name: string, websiteUrl?: string) {
    this.id = id;
    this.name = name;
    this.websiteUrl = websiteUrl || undefined;
  }
}
