import { ApiProperty } from '@nestjs/swagger';
import { ConversionFunnelResult } from 'src/domain/landbot-customer/landbot-customer.repository.interface';

export class LandbotCustomerCalculateFunnelConversionView {
  @ApiProperty({
    example: {
      totalSimulations: 105,
      totalHouseholdProvided: 105,
      totalEligble: 84,
      totalConnectionWish: 54,
      totalEmailProvided: 32,
      totalDesiredCityProvided: 32,
    },
  })
  public data: ConversionFunnelResult;

  constructor(payload: ConversionFunnelResult) {
    this.data = payload;
  }
}
