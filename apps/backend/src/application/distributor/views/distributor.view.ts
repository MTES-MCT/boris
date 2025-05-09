import { ApiProperty } from '@nestjs/swagger';
import { OfsView } from 'src/application/ofs/views/ofs.view';

type Ofs = Omit<OfsView, 'distributors' | 'createdAt' | 'updatedAt'>;

export class DistributorView {
  @ApiProperty({ example: '5d33fedc-7a06-48a4-b53d-05bf2da446dc' })
  public id: string;

  @ApiProperty({ example: 'Commercialisateur du Finistère' })
  public name: string;

  @ApiProperty({ example: 'https://ofs-de-bretagne.fr' })
  public websiteUrl: string;

  @ApiProperty()
  public ofss: Ofs[];

  @ApiProperty({ required: false })
  public createdAt?: Date;

  @ApiProperty({ required: false })
  public updatedAt?: Date;

  constructor(
    id: string,
    name: string,
    websiteUrl: string,
    ofss: Ofs[],
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id;
    this.name = name;
    this.websiteUrl = websiteUrl;
    this.ofss = ofss;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
