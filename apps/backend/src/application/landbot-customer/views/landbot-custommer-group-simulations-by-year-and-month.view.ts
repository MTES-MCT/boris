import { ApiProperty } from '@nestjs/swagger';
import { GroupSimulationsByYearAndMonthResult } from 'src/domain/landbot-customer/landbot-customer.repository.interface';

export class LandbotCustomerGroupSimulationsByYearAndMonthView {
  @ApiProperty({
    example: [
      { year: 2024, month: 1, count: 100 },
      { year: 2024, month: 2, count: 200 },
    ],
  })
  public data: GroupSimulationsByYearAndMonthResult[];

  constructor(payload: GroupSimulationsByYearAndMonthResult[]) {
    this.data = payload;
  }
}
