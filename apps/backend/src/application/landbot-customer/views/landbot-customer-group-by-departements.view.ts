import { ApiProperty } from '@nestjs/swagger';
import { GroupByDepartementsResult } from 'src/domain/landbot-customer/landbot-customer.repository.interface';

export class LandbotCustomerGroupByDepartementsView {
  @ApiProperty({
    example: [
      {
        departementCode: '29',
        count: '32',
      },
      {
        departementCode: '75',
        count: '18',
      },
      {
        departementCode: '13',
        count: '2',
      },
    ],
  })
  public data: GroupByDepartementsResult[];

  constructor(payload: GroupByDepartementsResult[]) {
    this.data = payload;
  }
}
