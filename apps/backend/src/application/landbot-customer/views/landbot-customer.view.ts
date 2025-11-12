import { ApiProperty } from '@nestjs/swagger';
import { DepartementRelationnalView } from 'src/application/departement/views/relationnal.view';
import {
  LandbotBrsKnowledge,
  LandbotEligibility,
  LandbotRealEstateSituation,
} from 'src/domain/landbot-customer/landbot-customer.interface';

export class LandbotCustomerView {
  @ApiProperty({ example: '5d33fedc-7a06-48a4-b53d-05bf2da446dc' })
  public id: string;

  @ApiProperty({
    example: '2024-01-15',
  })
  public date: Date;

  @ApiProperty({
    type: /* istanbul ignore next */ () => DepartementRelationnalView,
  })
  public departement?: DepartementRelationnalView;

  @ApiProperty({
    example: LandbotEligibility.TOUTE_LA_FRANCE,
  })
  public eligibility?: LandbotEligibility;

  @ApiProperty({
    example: LandbotBrsKnowledge.OUI,
  })
  public brsKnowledge?: LandbotBrsKnowledge;

  @ApiProperty({
    example: LandbotRealEstateSituation.PROPRIETAIRE,
  })
  public realEstateSituation?: LandbotRealEstateSituation;
  constructor(
    id: string,
    date: Date,
    departement?: DepartementRelationnalView,
    eligibility?: LandbotEligibility,
    brsKnowledge?: LandbotBrsKnowledge,
    realEstateSituation?: LandbotRealEstateSituation,
  ) {
    this.id = id;
    this.date = date;
    this.eligibility = eligibility;
    this.brsKnowledge = brsKnowledge;
    this.realEstateSituation = realEstateSituation;
    this.departement = departement;
  }
}
