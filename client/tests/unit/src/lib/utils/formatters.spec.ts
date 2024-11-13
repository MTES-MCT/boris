import { describe, it, expect } from 'vitest';
import { formatOFSs } from '$lib/utils/formatters';
import { expectedResult, OFSs } from '$tests/mocks/OFSs';

describe('formatOFSs', () => {
  it('should format an OFS list to a region based list', () => {
    const result = formatOFSs(OFSs);
    expect(result).toStrictEqual(expectedResult);
  });

  it('should return an empty array when OFSs list is empty', () => {
    const result = formatOFSs([]);
    expect(result).toStrictEqual([]);
  });
});
