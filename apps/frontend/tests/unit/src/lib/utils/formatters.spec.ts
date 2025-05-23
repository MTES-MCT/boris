import { describe, it, expect } from 'vitest';
import {
  formatEuro,
  formatOfss,
  formatPublishedAt,
} from '$lib/utils/formatters';
import { expectedResult, ofss } from '$tests/mocks/ofss';

describe('formatOfss', () => {
  it('should format an OFS list to a region based list', () => {
    const result = formatOfss(ofss);
    expect(result).toStrictEqual(expectedResult);
  });

  it('should return an empty array when OFSs list is empty', () => {
    const result = formatOfss([]);
    expect(result).toStrictEqual([]);
  });
});

describe('formatEuro', () => {
  it('should format a number to an amount in euro', () => {
    expect(formatEuro(1)).toMatch('1 €');
    expect(formatEuro(123)).toMatch('123 €');
    expect(formatEuro(1234)).toMatch('1 234 €');
    expect(formatEuro(123456)).toMatch('123 456 €');
    expect(formatEuro(123456.22)).toMatch('123 456 €');
    expect(formatEuro(123456.77)).toMatch('123 457 €');
  });
});

describe('formatPublishedAt', () => {
  it('should correctly format a date', () => {
    expect(formatPublishedAt('2025-01-07T15:15:15.899904+01:00')).toMatch(
      'Publié le 7 janvier 2025 à 15:15',
    );
  });
});
