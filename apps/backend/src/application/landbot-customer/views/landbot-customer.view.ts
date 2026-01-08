import { ApiProperty } from '@nestjs/swagger';
import { DepartementRelationnalView } from 'src/application/departement/views/relationnal.view';
import {
  LandbotBrsKnowledge,
  LandbotConnectionWish,
  LandbotDeclarationType,
  LandbotDisability,
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
    example: 'Paris',
  })
  public desiredCity?: string;

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

  @ApiProperty({
    example: LandbotDisability.NON,
  })
  public disability?: LandbotDisability;

  @ApiProperty({
    example: LandbotDeclarationType.ACHAT_SEUL_SOUHAIT_SEUL,
  })
  public declarationType?: LandbotDeclarationType;

  @ApiProperty({
    example: LandbotConnectionWish.OUI,
  })
  public connectionWish?: LandbotConnectionWish;

  @ApiProperty({
    example: 100000,
  })
  public resources?: number;

  @ApiProperty({ example: true })
  public hasProvidedEmail?: boolean;

  constructor(
    id: string,
    date: Date,
    desiredCity?: string,
    departement?: DepartementRelationnalView,
    eligibility?: LandbotEligibility,
    brsKnowledge?: LandbotBrsKnowledge,
    realEstateSituation?: LandbotRealEstateSituation,
    disability?: LandbotDisability,
    declarationType?: LandbotDeclarationType,
    connectionWish?: LandbotConnectionWish,
    resources?: number,
    hasProvidedEmail?: boolean,
  ) {
    this.id = id;
    this.date = date;
    this.desiredCity = desiredCity;
    this.eligibility = eligibility;
    this.brsKnowledge = brsKnowledge;
    this.realEstateSituation = realEstateSituation;
    this.departement = departement;
    this.disability = disability;
    this.declarationType = declarationType;
    this.connectionWish = connectionWish;
    this.resources = resources;
    this.hasProvidedEmail = hasProvidedEmail;
  }
}
