import { ApiProperty } from '@nestjs/swagger';

export class LandbotCustomerCalculateFunnelConversionView {
  @ApiProperty({
    example: 105,
  })
  public totalSimulations: number;

  @ApiProperty({
    example: 100,
  })
  public totalHouseholdProvided: number;

  @ApiProperty({
    example: 84,
  })
  public totalEligble: number;

  @ApiProperty({
    example: 54,
  })
  public totalConnectionWish: number;

  @ApiProperty({
    example: 32,
  })
  public totalEmailProvided: number;

  @ApiProperty({
    example: 22,
  })
  public totalDesiredCityProvided: number;

  constructor(
    totalSimulations: number,
    totalHouseholdProvided: number,
    totalEligble: number,
    totalConnectionWish: number,
    totalEmailProvided: number,
    totalDesiredCityProvided: number,
  ) {
    this.totalSimulations = totalSimulations;
    this.totalHouseholdProvided = totalHouseholdProvided;
    this.totalEligble = totalEligble;
    this.totalConnectionWish = totalConnectionWish;
    this.totalEmailProvided = totalEmailProvided;
    this.totalDesiredCityProvided = totalDesiredCityProvided;
  }
}
