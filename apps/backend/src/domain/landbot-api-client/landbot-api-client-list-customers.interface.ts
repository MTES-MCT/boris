import {
  LandbotBrsKnowledge,
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
  handicap?: string;
  declaration_seul_en_commun?: string;
  miseenrelation_yesno?: string;
  ressources?: string;
};

export type LandbotApiClientListCustomersInterface = {
  success: boolean;
  total: number;
  customers: LandbotApiClientCustomer[];
};
