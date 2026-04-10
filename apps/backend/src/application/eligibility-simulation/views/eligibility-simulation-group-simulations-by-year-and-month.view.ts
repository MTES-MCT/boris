import { ApiProperty } from '@nestjs/swagger';
import { GroupSimulationsByYearAndMonthResult } from 'src/domain/eligibility-simulation/eligibility-simulation.repository.interface';

export class EligibilitySimulationGroupSimulationsByYearAndMonthView {
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
