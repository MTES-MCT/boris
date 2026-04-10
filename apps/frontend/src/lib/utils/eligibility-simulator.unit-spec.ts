import {
  defineHighestEligibilityZone,
  type EligibilityCategory,
} from './eligibility-simulator';

describe('defineHighestEligibilityZone', () => {
  it('should return B2_AND_C when all zones are eligible', () => {
    const eligibility: EligibilityCategory = {
      category: 3,
      eligibleZoneAandAbis: true,
      eligibleZoneB1: true,
      eligibleZoneB2andC: true,
    };

    expect(defineHighestEligibilityZone(eligibility)).toBe('B2_AND_C');
  });

  it('should return B1 when A_AND_ABIS and B1 are eligible', () => {
    const eligibility: EligibilityCategory = {
      category: 3,
      eligibleZoneAandAbis: true,
      eligibleZoneB1: true,
      eligibleZoneB2andC: false,
    };

    expect(defineHighestEligibilityZone(eligibility)).toBe('B1');
  });

  it('should return A_AND_ABIS when only A_AND_ABIS is eligible', () => {
    const eligibility: EligibilityCategory = {
      category: 3,
      eligibleZoneAandAbis: true,
      eligibleZoneB1: false,
      eligibleZoneB2andC: false,
    };

    expect(defineHighestEligibilityZone(eligibility)).toBe('A_AND_ABIS');
  });
});
