import { ApiProperty } from '@nestjs/swagger';

export type GroupByViewPayload<K extends PropertyKey, V> = Array<
  {
    [P in K]: V;
  } & {
    count: string;
  }
>;

export class EligibilitySimulationGroupByFieldView<K extends PropertyKey, V> {
  @ApiProperty({
    example: [
      { eligibility: 'A_AND_ABIS', count: '32' },
      { eligibility: 'B1', count: '18' },
      { eligibility: 'NONE', count: '2' },
    ],
  })
  public data: GroupByViewPayload<K, V>;

  constructor(payload: GroupByViewPayload<K, V>) {
    this.data = payload;
  }
}
