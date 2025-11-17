import { LandbotCustomerEntity } from 'src/infrastructure/landbot-customer/landbot-customer.entity';
import {
  LandbotBrsKnowledge,
  LandbotEligibility,
  LandbotRealEstateSituation,
} from 'src/domain/landbot-customer/landbot-customer.interface';
import { finistere } from './departement';

export const mockedLandbotCustomer = new LandbotCustomerEntity(
  new Date('2024-01-15'),
  'Paris',
  finistere,
  LandbotEligibility.ZONE_TENDUE,
  LandbotBrsKnowledge.OUI,
  LandbotRealEstateSituation.PROPRIETAIRE,
);

export const mockLandbotCustomerRepository = {
  save: jest.fn(),
  findOne: jest.fn(),
  findLast: jest.fn(),
};
