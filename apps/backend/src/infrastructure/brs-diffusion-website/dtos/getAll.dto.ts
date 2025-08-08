import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { DEFAULT_RADIUS } from 'src/application/brs-diffusion-website/usecases/findAll.usecase';

export class GetAllBrsDiffusionWebsitesDTO {
  @ApiPropertyOptional({
    description: 'La latitude du point de référence',
    example: 48.85341,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'La latitude doit être un nombre décimal' })
  @IsOptional()
  public latitude: number;

  @ApiPropertyOptional({
    description: 'La longitude du point de référence',
    example: 2.3488,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'La longitude doit être un nombre décimal' })
  @IsOptional()
  public longitude: number;

  @ApiPropertyOptional({
    description: `Le rayon en kilomètres, par défaut ${DEFAULT_RADIUS}km`,
    example: DEFAULT_RADIUS,
  })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(1000)
  public radius: number;
}
