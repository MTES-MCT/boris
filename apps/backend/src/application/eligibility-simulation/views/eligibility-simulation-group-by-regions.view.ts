import { ApiProperty } from '@nestjs/swagger';
import { GroupByRegionsResult } from 'src/domain/eligibility-simulation/eligibility-simulation.repository.interface';

export class EligibilitySimulationGroupByRegionsView {
  @ApiProperty({
    example: [
      {
        regionName: 'Ile-de-France',
        regionCode: '11',
        count: '32',
      },
    ],
  })
  public data: GroupByRegionsResult[];

  @ApiProperty({ example: 100 })
  public total: number;

  constructor(payload: GroupByRegionsResult[], total: number) {
    this.data = payload;
    this.total = total;
  }
}
