import {
  LandbotBrsKnowledge,
  LandbotEligibility,
  LandbotRealEstateSituation,
} from 'src/domain/landbot-customer/landbot-customer.interface';

export interface CreateLandbotCustomerParams {
  date: Date;
  desiredCity?: string;
  departementCode?: string;
  eligibility?: LandbotEligibility;
  brsKnowledge?: LandbotBrsKnowledge;
  realEstateSituation?: LandbotRealEstateSituation;
}
