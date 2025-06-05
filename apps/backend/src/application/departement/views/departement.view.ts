import { ApiProperty } from '@nestjs/swagger';

export class DepartementView {
  @ApiProperty({ example: '5d33fedc-7a06-48a4-b53d-05bf2da446dc' })
  public id: string;

  @ApiProperty({ example: 'Finistère' })
  public name: string;

  @ApiProperty({ example: '29' })
  public code: string;

  constructor(id: string, name: string, code: string) {
    this.id = id;
    this.name = name;
    this.code = code;
  }
}
