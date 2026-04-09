export type EligibilityStatsBucket = 'A_AND_ABIS' | 'B1' | 'B2_AND_C' | 'NONE';

export type EligibilityStatsItem = {
  eligibility: EligibilityStatsBucket;
  count: string;
};
