import { describe, it, expect } from 'vitest';
import {
  formatDepartements,
  formatEuro,
  formatOFSs,
  formatPublishedAt,
} from '$lib/utils/formatters';
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

describe('formatDepartements', () => {
  it('should correctly format departements', () => {
    expect(formatDepartements('')).toMatch('');
    expect(formatDepartements('Finistère')).toMatch('BRS Finistère');
    expect(formatDepartements('Finistère, Morbihan')).toMatch(
      'BRS Finistère, BRS Morbihan',
    );
    expect(
      formatDepartements("Finistère, Morbihan, Côtes d'Armor, Ille-et-Vilaine"),
    ).toMatch(
      "BRS Finistère, BRS Morbihan, BRS Côtes d'Armor, BRS Ille-et-Vilaine",
    );
  });
});
