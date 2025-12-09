import { ApiProperty } from '@nestjs/swagger';
import { GroupByRegionsResult } from 'src/domain/landbot-customer/landbot-customer.repository.interface';

export class LandbotCustomerGroupByRegionsView {
  @ApiProperty({
    example: [
      {
        regionName: 'Ile-de-France',
        regionCode: '11',
        count: '32',
      },
      {
        regionName: "Provence-Alpes-Côte d'Azur",
        regionCode: '93',
        count: '18',
      },
      {
        regionName: 'Auvergne-Rhône-Alpes',
        regionCode: '84',
        count: '2',
      },
    ],
  })
  public data: GroupByRegionsResult[];

  @ApiProperty({
    example: 100,
  })
  public total: number;

  constructor(payload: GroupByRegionsResult[], total: number) {
    this.data = payload;
    this.total = total;
  }
}
