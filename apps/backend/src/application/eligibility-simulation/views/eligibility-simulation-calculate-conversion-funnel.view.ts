import { ApiProperty } from '@nestjs/swagger';

export class EligibilitySimulationCalculateConversionFunnelView {
  @ApiProperty({ example: 105 })
  public totalSimulations: number;

  @ApiProperty({ example: 100 })
  public totalHouseholdProvided: number;

  @ApiProperty({ example: 84 })
  public totalEligible: number;

  @ApiProperty({ example: 54 })
  public totalConnectionWish: number;

  @ApiProperty({ example: 32 })
  public totalEmailProvided: number;

  @ApiProperty({ example: 22 })
  public totalDesiredCityProvided: number;

  constructor(
    totalSimulations: number,
    totalHouseholdProvided: number,
    totalEligible: number,
    totalConnectionWish: number,
    totalEmailProvided: number,
    totalDesiredCityProvided: number,
  ) {
    this.totalSimulations = totalSimulations;
    this.totalHouseholdProvided = totalHouseholdProvided;
    this.totalEligible = totalEligible;
    this.totalConnectionWish = totalConnectionWish;
    this.totalEmailProvided = totalEmailProvided;
    this.totalDesiredCityProvided = totalDesiredCityProvided;
  }
}
