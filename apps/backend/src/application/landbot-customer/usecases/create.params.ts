import {
  LandbotBrsKnowledge,
  LandbotConnectionWish,
  LandbotDeclarationType,
  LandbotEligibility,
  LandbotDisability,
  LandbotRealEstateSituation,
} from 'src/domain/landbot-customer/landbot-customer.interface';

export interface CreateLandbotCustomerParams {
  date: Date;
  desiredCity?: string;
  departementCode?: string;
  eligibility?: LandbotEligibility;
  brsKnowledge?: LandbotBrsKnowledge;
  realEstateSituation?: LandbotRealEstateSituation;
  disability?: LandbotDisability;
  declarationType?: LandbotDeclarationType;
  connectionWish?: LandbotConnectionWish;
  resources?: number;
  hasProvidedEmail?: boolean;
}
