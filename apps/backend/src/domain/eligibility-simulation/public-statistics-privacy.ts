export const PUBLIC_STATISTICS_MINIMUM_COHORT_SIZE = 5;

export type CountedStatistic = {
  count: number;
};

export type SuppressedCountedStatistic<T extends CountedStatistic> = Omit<
  T,
  'count'
> & {
  count: number | null;
};

export const suppressSmallDistribution = <T extends CountedStatistic>(
  items: T[],
): {
  items: SuppressedCountedStatistic<T>[];
  total: number | null;
} => {
  const total = items.reduce((sum, item) => sum + item.count, 0);
  const suppressedIndexes = new Set(
    items
      .map((item, index) => ({ count: item.count, index }))
      .filter(
        ({ count }) =>
          count > 0 && count < PUBLIC_STATISTICS_MINIMUM_COHORT_SIZE,
      )
      .map(({ index }) => index),
  );

  if (suppressedIndexes.size === 1) {
    const secondarySuppression = items
      .map((item, index) => ({ count: item.count, index }))
      .filter(({ index }) => !suppressedIndexes.has(index))
      .sort((first, second) => first.count - second.count)[0];

    if (secondarySuppression) {
      suppressedIndexes.add(secondarySuppression.index);
    }
  }

  return {
    items: items.map((item, index) => ({
      ...item,
      count: suppressedIndexes.has(index) ? null : item.count,
    })),
    total: suppressedIndexes.size > 0 ? null : total,
  };
};

export const suppressAndOmitSmallDistribution = <T extends CountedStatistic>(
  items: T[],
): SuppressedCountedStatistic<T>[] => {
  const protectedItems = suppressSmallDistribution(items).items;

  return protectedItems.filter(
    (_, index) =>
      items[index].count >= PUBLIC_STATISTICS_MINIMUM_COHORT_SIZE,
  );
};

export const suppressBinaryCount = (
  count: number,
  total: number,
): number | null => {
  const complement = total - count;
  const isSmall = (value: number) =>
    value > 0 && value < PUBLIC_STATISTICS_MINIMUM_COHORT_SIZE;

  return isSmall(count) || isSmall(complement) ? null : count;
};
