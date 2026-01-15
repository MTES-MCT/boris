import { ApiProperty } from '@nestjs/swagger';

export class AcquisitionSimulationCalculateFunnelConversionView {
  @ApiProperty({
    example: 105,
  })
  public totalHouseInformations: number;

  @ApiProperty({
    example: 100,
  })
  public totalOwnContribution: number;

  @ApiProperty({
    example: 84,
  })
  public totalBuyingFees: number;

  @ApiProperty({
    example: 54,
  })
  public totalLoanInformations: number;

  @ApiProperty({
    example: 32,
  })
  public totalBrsHousingFees: number;

  constructor(
    totalHouseInformations: number,
    totalOwnContribution: number,
    totalBuyingFees: number,
    totalLoanInformations: number,
    totalBrsHousingFees: number,
  ) {
    this.totalHouseInformations = totalHouseInformations;
    this.totalOwnContribution = totalOwnContribution;
    this.totalBuyingFees = totalBuyingFees;
    this.totalLoanInformations = totalLoanInformations;
    this.totalBrsHousingFees = totalBrsHousingFees;
  }
}
