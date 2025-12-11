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
  findLast: jest.fn(),
  createQueryBuilder: jest.fn(),
  groupByEligibility: jest.fn(),
  groupByBrsKnowledge: jest.fn(),
  groupByRealEstateSituation: jest.fn(),
  countSimulations: jest.fn(),
  groupByRegions: jest.fn(),
  groupSimulationsByYearAndMonth: jest.fn(),
};

export const mockGroupByEligibilityResults = [
  { eligibility: 2, count: '10' },
  { eligibility: 3, count: '5' },
  { eligibility: null, count: '2' },
];

export const mockGroupByBrsKnowledgeResults = [
  { brsKnowledge: 'Oui', count: '8' },
  { brsKnowledge: 'Non', count: '4' },
];

export const mockGroupByRealEstateSituationResults = [
  { realEstateSituation: "propriétaire d'un logement", count: '5' },
  { realEstateSituation: "locataire d'un logement privé", count: '3' },
  { realEstateSituation: null, count: '2' },
];

export const mockGroupSimulationsByYearAndMonthResults = [
  { year: 2024, month: 5, count: '7' },
  { year: 2024, month: 6, count: '3' },
];
