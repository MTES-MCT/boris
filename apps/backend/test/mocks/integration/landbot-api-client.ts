import { LandbotApiClientListCustomersInterface } from 'src/domain/landbot-api-client/landbot-api-client-list-customers.interface';
import {
  LandbotBrsKnowledge,
  LandbotEligibility,
  LandbotRealEstateSituation,
} from 'src/domain/landbot-customer/landbot-customer.interface';

export const mockedLandbotApiClientListCustomersResponse: LandbotApiClientListCustomersInterface =
  {
    success: true,
    total: 100,
    customers: [
      {
        id: 1,
        name: 'John Doe',
        channel_id: 123,
        last_message: 1234567890,
        register_date: 1234567890,
        eligibilite1: LandbotEligibility.ZONE_TENDUE,
        situation_immo: LandbotRealEstateSituation.PROPRIETAIRE,
        connaissancebrs: LandbotBrsKnowledge.OUI,
        departement: '29',
        ville_souhaitee: 'Paris',
      },
    ],
  };

export const mockedLandbotApiClientListCustomersResponseMultiple: LandbotApiClientListCustomersInterface =
  {
    success: true,
    total: 2,
    customers: [
      {
        id: 1,
        name: 'John Doe',
        channel_id: 123,
        last_message: 1234567890,
        register_date: 1234567890,
        eligibilite1: LandbotEligibility.ZONE_TENDUE,
        situation_immo: LandbotRealEstateSituation.PROPRIETAIRE,
        connaissancebrs: LandbotBrsKnowledge.OUI,
        departement: '29',
        ville_souhaitee: 'Paris',
      },
      {
        id: 2,
        name: 'Jane Smith',
        channel_id: 456,
        last_message: 1234567891,
        register_date: 1234567891,
        eligibilite1: LandbotEligibility.TOUTE_LA_FRANCE,
        situation_immo: LandbotRealEstateSituation.LOCATAIRE_PRIVE,
        connaissancebrs: LandbotBrsKnowledge.NON,
        departement: '75',
        ville_souhaitee: 'Lyon',
      },
    ],
  };

export const mockedLandbotApiClientListCustomersResponseEmpty: LandbotApiClientListCustomersInterface =
  {
    success: true,
    total: 0,
    customers: [],
  };

export const mockedLandbotApiClientListCustomersResponseMinimal: LandbotApiClientListCustomersInterface =
  {
    success: true,
    total: 1,
    customers: [
      {
        id: 1,
        name: 'John Doe',
        channel_id: 123,
        last_message: 1234567890,
        register_date: 1234567890,
      },
    ],
  };

export const mockLandbotApiClientRepository = {
  listCustomers: jest.fn(),
};
