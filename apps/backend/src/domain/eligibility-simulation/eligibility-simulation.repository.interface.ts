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

export type PublicEligibilityStatisticsFilters = {
  departementCode?: string;
  postalCode?: string;
};

export type PublicEligibilityStatisticsDistribution = {
  label: string;
  count: number | null;
};

export type PublicEligibilityStatisticsResult = {
  updatedAt: string | null;
  totals: {
    simulations: number;
    eligible: number | null;
    contactable: number | null;
    geolocated: number | null;
  };
  regions: (PublicEligibilityStatisticsDistribution & { code: string })[];
  zones: {
    postalCode: string;
    departementCode: string;
    count: number | null;
  }[];
  householdSizes: PublicEligibilityStatisticsDistribution[];
  propertySituations: PublicEligibilityStatisticsDistribution[];
  incomeRanges: PublicEligibilityStatisticsDistribution[];
  employmentStatuses: PublicEligibilityStatisticsDistribution[];
  housingTypes: PublicEligibilityStatisticsDistribution[];
  brsKnowledge: PublicEligibilityStatisticsDistribution[];
  breakdownTotals: {
    householdSizes: number | null;
    propertySituations: number | null;
    incomeRanges: number | null;
    employmentStatuses: number | null;
    housingTypes: number | null;
    brsKnowledge: number | null;
  };
  filters: {
    departements: { code: string; name: string }[];
    postalCodes: string[];
  };
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
  action: string | null;
  status: string | null;
  transmittedDistributors?: { id: string; name: string }[];
  ofsId?: string;
  ofsName?: string;
  ofsEmail?: string | null;
  ofsPhone?: string | null;
  ofsWebsiteUrl?: string | null;
};

export type PortalEligibilitySimulationContactFilters = {
  ofsId: string;
  departementIds: string[];
  startDate?: string;
  endDate?: string;
};

export type DistributorPortalContactFilters = {
  distributorId: string;
  ofsId?: string;
  startDate?: string;
  endDate?: string;
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
  getPublicStatistics(
    filters: PublicEligibilityStatisticsFilters,
  ): Promise<PublicEligibilityStatisticsResult | null>;
  findPortalContactsByOfsScope(
    pagination: PaginationProps,
    filters: PortalEligibilitySimulationContactFilters,
  ): Promise<[PortalEligibilitySimulationContactResult[], total: number]>;
  findAllPortalContactsByOfsScope(
    filters: PortalEligibilitySimulationContactFilters,
  ): Promise<PortalEligibilitySimulationContactResult[]>;
  countPortalContactsByOfsScope(
    filters: PortalEligibilitySimulationContactFilters,
  ): Promise<number>;
  hasPortalContactInOfsScope(
    simulationId: string,
    filters: PortalEligibilitySimulationContactFilters,
  ): Promise<boolean>;
  findPortalContactsByDistributorScope(
    pagination: PaginationProps,
    filters: DistributorPortalContactFilters,
  ): Promise<[PortalEligibilitySimulationContactResult[], total: number]>;
  findAllPortalContactsByDistributorScope(
    filters: DistributorPortalContactFilters,
  ): Promise<PortalEligibilitySimulationContactResult[]>;
  hasPortalContactInDistributorScope(
    simulationId: string,
    filters: DistributorPortalContactFilters,
  ): Promise<boolean>;
}
