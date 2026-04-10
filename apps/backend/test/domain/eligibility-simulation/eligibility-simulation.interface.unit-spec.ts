import { getHighestEligibilityZone } from 'src/domain/eligibility-simulation/eligibility-simulation.interface';

describe('getHighestEligibilityZone', () => {
  it('returns B2_AND_C when all zones are eligible', () => {
    expect(
      getHighestEligibilityZone({
        category: 3,
        eligibleZoneAandAbis: true,
        eligibleZoneB1: true,
        eligibleZoneB2andC: true,
      }),
    ).toBe('B2_AND_C');
  });

  it('returns B1 when A_AND_ABIS and B1 are eligible', () => {
    expect(
      getHighestEligibilityZone({
        category: 3,
        eligibleZoneAandAbis: true,
        eligibleZoneB1: true,
        eligibleZoneB2andC: false,
      }),
    ).toBe('B1');
  });

  it('returns A_AND_ABIS when only A_AND_ABIS is eligible', () => {
    expect(
      getHighestEligibilityZone({
        category: 3,
        eligibleZoneAandAbis: true,
        eligibleZoneB1: false,
        eligibleZoneB2andC: false,
      }),
    ).toBe('A_AND_ABIS');
  });
});
