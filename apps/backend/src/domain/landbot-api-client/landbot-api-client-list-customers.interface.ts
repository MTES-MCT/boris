type LandbotApiClientCustomerCustomField = {
  value: string;
  type: string;
  name: string;
};

type LandbotApiClientCustomer = {
  id: number;
  name: string;
  channel_id: number;
  last_message: number;
  register_date: number;
  custom_fields: {
    eligibilite1: LandbotApiClientCustomerCustomField;
    brsKnowledge: LandbotApiClientCustomerCustomField;
    realEstateSituation: LandbotApiClientCustomerCustomField;
  };
};

export type LandbotApiClientListCustomersInterface = {
  success: boolean;
  total: number;
  customers: LandbotApiClientCustomer[];
};
