import { EligibilitySimulationEntity } from 'src/infrastructure/eligibility-simulation/eligibility-simulation.entity';
import { HighestEligibilityZone } from './eligibility-simulation.interface';
import { RegionCode } from '../region/region.interface';
import { PaginationProps } from '../common/paginationProps';

export type GroupByEligibilityStatsResult = {
  eligibility: HighestEligibilityZone;
  count: string;
};

export type GroupByBrsKnowledgeResult = {
  brsKnowledge: 'Oui' | 'Non' | 'Je ne suis pas sûr·e' | null;
  count: string;
};

export type GroupByRealEstateSituationResult = {
  realEstateSituation:
    | "propriétaire d'un logement"
    | "locataire d'un logement social"
    | "locataire d'un logement privé"
    | 'hebergé·e'
    | 'dans une autre situation immobilière'
    | null;
  count: string;
};

export type GroupSimulationsByYearAndMonthResult = {
  year: number;
  month: number;
  count: number;
};

export type GroupByRegionsResult = {
  regionName: string;
  regionCode: RegionCode;
  count: string;
};

export type GroupByDepartementsResult = {
  departementCode: string;
  count: string;
};

export type EligibilitySimulationConversionFunnelResult = {
  totalSimulations: number;
  totalHouseholdProvided: number;
  totalEligible: number;
  totalConnectionWish: number;
  totalEmailProvided: number;
  totalDesiredCityProvided: number;
};

export type PortalEligibilitySimulationContactResult = {
  simulationId: string;
  locationId: string;
  submittedAt: Date;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  departementCode: string | null;
  city: string | null;
  contribution: number | null;
  householdSize: number | null;
  hasDisability: boolean | null;
  taxableIncome: number | null;
  propertySituation: string | null;
  housingType: string | null;
  resources: number | null;
};

export interface EligibilitySimulationRepositoryInterface {
  save(
    eligibilitySimulation: EligibilitySimulationEntity,
  ): Promise<EligibilitySimulationEntity>;
  findById(id: string): Promise<EligibilitySimulationEntity | null>;
  groupByEligibilityStats(): Promise<GroupByEligibilityStatsResult[]>;
  groupByBrsKnowledge(): Promise<GroupByBrsKnowledgeResult[]>;
  groupByRealEstateSituation(): Promise<GroupByRealEstateSituationResult[]>;
  groupSimulationsByYearAndMonth(): Promise<
    GroupSimulationsByYearAndMonthResult[]
  >;
  groupByRegions(): Promise<[GroupByRegionsResult[], total: number]>;
  groupByDepartements(): Promise<GroupByDepartementsResult[]>;
  calculateConversionFunnel(): Promise<EligibilitySimulationConversionFunnelResult>;
  findPortalContactsByOfsScope(
    pagination: PaginationProps,
    filters: { departementIds: string[]; regionIds: string[] },
  ): Promise<[PortalEligibilitySimulationContactResult[], total: number]>;
}
