export type EligibilityStatsBucket = 'A_AND_ABIS' | 'B1' | 'B2_AND_C' | 'NONE';

export type EligibilityStatsItem = {
  eligibility: EligibilityStatsBucket;
  count: string;
};

export type PublicEligibilityStatisticsDistribution = {
  label: string;
  count: number;
};

export type PublicEligibilityStatistics = {
  updatedAt: string | null;
  totals: {
    simulations: number;
    eligible: number;
    contactable: number;
    geolocated: number;
  };
  regions: (PublicEligibilityStatisticsDistribution & { code: string })[];
  zones: {
    postalCode: string;
    departementCode: string;
    count: number;
  }[];
  householdSizes: PublicEligibilityStatisticsDistribution[];
  propertySituations: PublicEligibilityStatisticsDistribution[];
  incomeRanges: PublicEligibilityStatisticsDistribution[];
  employmentStatuses: PublicEligibilityStatisticsDistribution[];
  housingTypes: PublicEligibilityStatisticsDistribution[];
  brsKnowledge: PublicEligibilityStatisticsDistribution[];
  filters: {
    departements: { code: string; name: string }[];
    postalCodes: string[];
  };
};
