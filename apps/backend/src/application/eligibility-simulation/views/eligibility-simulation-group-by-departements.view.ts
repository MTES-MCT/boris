import { ApiProperty } from '@nestjs/swagger';
import { GroupByDepartementsResult } from 'src/domain/eligibility-simulation/eligibility-simulation.repository.interface';

export class EligibilitySimulationGroupByDepartementsView {
  @ApiProperty({
    example: [
      {
        departementCode: '29',
        count: '32',
      },
    ],
  })
  public data: GroupByDepartementsResult[];

  constructor(payload: GroupByDepartementsResult[]) {
    this.data = payload;
  }
}
