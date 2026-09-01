export type EligibilityStatsBucket = 'A_AND_ABIS' | 'B1' | 'B2_AND_C' | 'NONE';

export type EligibilityStatsItem = {
  eligibility: EligibilityStatsBucket;
  count: string;
};

export type PublicEligibilityStatisticsDistribution = {
  label: string;
  count: number | null;
};

export type PublicEligibilityStatistics = {
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
