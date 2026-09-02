import {
  suppressAndOmitSmallDistribution,
  suppressBinaryCount,
  suppressSmallDistribution,
} from 'src/domain/eligibility-simulation/public-statistics-privacy';

describe('public statistics privacy', () => {
  it('masks cells containing fewer than five simulations', () => {
    const result = suppressSmallDistribution([
      { label: 'T1', count: 3 },
      { label: 'T2', count: 8 },
      { label: 'T3', count: 12 },
    ]);

    expect(result).toEqual({
      items: [
        { label: 'T1', count: null },
        { label: 'T2', count: null },
        { label: 'T3', count: 12 },
      ],
      total: null,
    });
  });

  it('does not mask cells when every count is at least five', () => {
    const result = suppressSmallDistribution([
      { label: 'T2', count: 5 },
      { label: 'T3', count: 12 },
    ]);

    expect(result).toEqual({
      items: [
        { label: 'T2', count: 5 },
        { label: 'T3', count: 12 },
      ],
      total: 17,
    });
  });

  it('omits a small geographic cell and masks a complementary published cell', () => {
    const result = suppressAndOmitSmallDistribution([
      { postalCode: '75001', count: 2 },
      { postalCode: '75002', count: 8 },
      { postalCode: '75003', count: 12 },
    ]);

    expect(result).toEqual([
      { postalCode: '75002', count: null },
      { postalCode: '75003', count: 12 },
    ]);
  });

  it('masks a binary count when it or its complement is smaller than five', () => {
    expect(suppressBinaryCount(3, 20)).toBeNull();
    expect(suppressBinaryCount(17, 20)).toBeNull();
    expect(suppressBinaryCount(5, 20)).toBe(5);
    expect(suppressBinaryCount(20, 20)).toBe(20);
  });
});
