import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Matches } from 'class-validator';

export class PublicEligibilityStatisticsDto {
  @ApiPropertyOptional({ example: '75' })
  @IsOptional()
  @Matches(/^(?:\d{2,3}|2[AB])$/)
  public departementCode?: string;

  @ApiPropertyOptional({ example: '75001' })
  @IsOptional()
  @Matches(/^[0-9A-Z]{2,5}$/)
  public postalCode?: string;
}
