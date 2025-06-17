import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class IdDTO {
  @ApiProperty({
    description: "L'identifiant de la ressource",
    example: '5d33fedc-7a06-48a4-b53d-05bf2da446dc',
  })
  @IsUUID()
  public id: string;
}
