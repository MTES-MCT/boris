import {
  LandbotBrsKnowledge,
  LandbotConnectionWish,
  LandbotDeclarationType,
  LandbotDisability,
  LandbotEligibility,
  LandbotRealEstateSituation,
} from '../landbot-customer/landbot-customer.interface';

type LandbotApiClientCustomer = {
  id: number;
  name: string;
  channel_id: number;
  last_message: number;
  register_date: number;
  eligibilite1?: LandbotEligibility;
  situation_immo?: LandbotRealEstateSituation;
  connaissancebrs?: LandbotBrsKnowledge;
  departement?: string;
  ville_souhaitee?: string;
  handicap?: LandbotDisability;
  declaration_seul_en_commun?: LandbotDeclarationType;
  miseenrelation_yesno?: LandbotConnectionWish;
  ressources?: string;
  email?: string;
};

export type LandbotApiClientListCustomersInterface = {
  success: boolean;
  total: number;
  customers: LandbotApiClientCustomer[];
};
