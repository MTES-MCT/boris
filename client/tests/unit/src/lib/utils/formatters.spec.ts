import { describe, it, expect } from 'vitest';
import { formatEuro, formatOFSs } from '$lib/utils/formatters';
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

describe('formatEuro', () => {
  it('should format a number to an amount in euro', () => {
    expect(formatEuro(1)).toBe('1 €');
    expect(formatEuro(123)).toMatch('123 €');
    expect(formatEuro(1234)).toMatch('1 234 €');
    expect(formatEuro(123456)).toMatch('123 456 €');
    expect(formatEuro(123456.22)).toMatch('123 456 €');
    expect(formatEuro(123456.77)).toMatch('123 457 €');
  });
});
