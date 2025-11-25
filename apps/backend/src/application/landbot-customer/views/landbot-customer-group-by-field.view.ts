import { ApiProperty } from '@nestjs/swagger';

export type GroupByViewPayload<K extends PropertyKey, V> = Array<
  {
    [P in K]: V;
  } & {
    count: string;
  }
>;

export class LandbotCustomerGroupByFieldView<K extends PropertyKey, V> {
  @ApiProperty({
    example: [
      { eligibility: '1', count: '32' },
      { eligibility: '2', count: '18' },
      { eligibility: 'null', count: '2' },
    ],
  })
  public data: GroupByViewPayload<K, V>;

  constructor(payload: GroupByViewPayload<K, V>) {
    this.data = payload;
  }
}
