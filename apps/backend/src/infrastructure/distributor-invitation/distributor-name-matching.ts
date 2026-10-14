export function normalizeDistributorName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function distance(left: string, right: string): number {
  let row = Array.from({ length: right.length + 1 }, (_, i) => i);
  for (let i = 1; i <= left.length; i++) {
    const next = [i];
    for (let j = 1; j <= right.length; j++) {
      next[j] = Math.min(
        next[j - 1] + 1,
        row[j] + 1,
        row[j - 1] + Number(left[i - 1] !== right[j - 1]),
      );
    }
    row = next;
  }
  return row[right.length];
}

export function matchDistributors<T extends { id: string; name: string }>(
  name: string,
  distributors: T[],
): T[] {
  const query = normalizeDistributorName(name);
  if (!query) return [];
  return distributors
    .map((item) => {
      const candidate = normalizeDistributorName(item.name);
      const score =
        query === candidate
          ? 1
          : query.length >= 3 &&
              candidate.length >= 3 &&
              (candidate.includes(query) || query.includes(candidate))
            ? 0.9
            : 1 -
              distance(query, candidate) /
                Math.max(query.length, candidate.length, 1);
      return { item, score };
    })
    .filter(({ score }) => score >= 0.72)
    .sort(
      (a, b) =>
        b.score - a.score || a.item.name.localeCompare(b.item.name, 'fr'),
    )
    .map(({ item }) => item);
}
