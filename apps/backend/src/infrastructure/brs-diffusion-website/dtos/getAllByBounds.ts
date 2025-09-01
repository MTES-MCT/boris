import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GetAllBrsDiffusionWebsitesByBoundsDTO {
  @ApiProperty({
    description: 'La latitude du point nord-est de référence',
    example: 48.85341,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'La latitude nord-est doit être un nombre décimal' })
  public northEastLat: number;

  @ApiProperty({
    description: 'La longitude du point nord-est de référence',
    example: 48.85341,
  })
  @Type(() => Number)
  @IsNumber(
    {},
    { message: 'La longitude nord-est doit être un nombre décimal' },
  )
  public northEastLng: number;

  @ApiProperty({
    description: 'La latitude du point sud-ouest de référence',
    example: 48.85341,
  })
  @Type(() => Number)
  @IsNumber(
    {},
    { message: 'La latitude sud-ouest doit être un nombre décimal' },
  )
  public southWestLat: number;

  @ApiProperty({
    description: 'La longitude du point sud-ouest de référence',
    example: 48.85341,
  })
  @Type(() => Number)
  @IsNumber(
    {},
    { message: 'La longitude sud-ouest doit être un nombre décimal' },
  )
  public southWestLng: number;
}
