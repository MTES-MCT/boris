import { ApiProperty } from '@nestjs/swagger';
import { HighestEligibilityZone } from 'src/domain/eligibility-simulation/eligibility-simulation.interface';

export type GroupByEligibilitySimulationFieldPayload = Array<{
  eligibility: HighestEligibilityZone;
  count: string;
}>;

export class EligibilitySimulationGroupByFieldView {
  @ApiProperty({
    example: [
      { eligibility: 'A_AND_ABIS', count: '32' },
      { eligibility: 'B1', count: '18' },
      { eligibility: 'B2_AND_C', count: '9' },
      { eligibility: 'NONE', count: '2' },
    ],
  })
  public data: GroupByEligibilitySimulationFieldPayload;

  constructor(payload: GroupByEligibilitySimulationFieldPayload) {
    this.data = payload;
  }
}
