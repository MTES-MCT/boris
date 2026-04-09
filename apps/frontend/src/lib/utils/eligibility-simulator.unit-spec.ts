import {
  defineHighestEligibilityZone,
  type EligibilityCategory,
} from './eligibility-simulator';

describe('defineHighestEligibilityZone', () => {
  it('should return A_AND_ABIS when all zones are eligible', () => {
    const eligibility: EligibilityCategory = {
      category: 3,
      eligibleZoneAandAbis: true,
      eligibleZoneB1: true,
      eligibleZoneB2andC: true,
    };

    expect(defineHighestEligibilityZone(eligibility)).toBe('A_AND_ABIS');
  });

  it('should return B1 when B1 and B2_AND_C are eligible', () => {
    const eligibility: EligibilityCategory = {
      category: 3,
      eligibleZoneAandAbis: false,
      eligibleZoneB1: true,
      eligibleZoneB2andC: true,
    };

    expect(defineHighestEligibilityZone(eligibility)).toBe('B1');
  });

  it('should return B2_AND_C when only B2_AND_C is eligible', () => {
    const eligibility: EligibilityCategory = {
      category: 3,
      eligibleZoneAandAbis: false,
      eligibleZoneB1: false,
      eligibleZoneB2andC: true,
    };

    expect(defineHighestEligibilityZone(eligibility)).toBe('B2_AND_C');
  });
});
