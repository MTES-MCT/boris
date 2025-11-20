import { describe, it, expect } from 'vitest';
import {
  formatEuro,
  formatNumber,
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
  const NBSP = '\u202f'; // Espace insécable utilisé par Intl.NumberFormat pour fr-FR

  it('should format a number to an amount in euro', () => {
    expect(formatEuro(1)).toBe('1\xa0€');
    expect(formatEuro(123)).toBe('123\xa0€');
    expect(formatEuro(1234)).toBe(`1${NBSP}234\xa0€`);
    expect(formatEuro(123456)).toBe(`123${NBSP}456\xa0€`);
    expect(formatEuro(123456.22)).toBe(`123${NBSP}456\xa0€`);
    expect(formatEuro(123456.77)).toBe(`123${NBSP}457\xa0€`);
  });
});

describe('formatPublishedAt', () => {
  it('should correctly format a date', () => {
    expect(formatPublishedAt('2025-01-07T15:15:15.899904+01:00')).toMatch(
      'Publié le 7 janvier 2025 à 15:15',
    );
  });
});

describe('formatNumber', () => {
  const NBSP = '\u202f'; // Espace insécable utilisé par Intl.NumberFormat pour fr-FR

  it('should format a number with French locale formatting', () => {
    expect(formatNumber(1)).toBe('1');
    expect(formatNumber(123)).toBe('123');
    expect(formatNumber(1234)).toBe(`1${NBSP}234`);
    expect(formatNumber(12345)).toBe(`12${NBSP}345`);
    expect(formatNumber(123456)).toBe(`123${NBSP}456`);
    expect(formatNumber(1234567)).toBe(`1${NBSP}234${NBSP}567`);
  });

  it('should round decimal numbers when maximumFractionDigits is 0 (default)', () => {
    expect(formatNumber(1.5)).toBe('2');
    expect(formatNumber(123.45)).toBe('123');
    expect(formatNumber(1234.567)).toBe(`1${NBSP}235`);
    expect(formatNumber(123456.789)).toBe(`123${NBSP}457`);
    expect(formatNumber(1.4)).toBe('1');
  });

  it('should format decimal numbers with specified maximumFractionDigits', () => {
    expect(formatNumber(1.5, 1)).toBe('1,5');
    expect(formatNumber(123.45, 2)).toBe('123,45');
    expect(formatNumber(1234.567, 3)).toBe(`1${NBSP}234,567`);
    expect(formatNumber(123456.789, 2)).toBe(`123${NBSP}456,79`);
    expect(formatNumber(1.456, 1)).toBe('1,5');
    expect(formatNumber(1.456, 2)).toBe('1,46');
  });

  it('should format zero correctly', () => {
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(0.0)).toBe('0');
    expect(formatNumber(0, 2)).toBe('0');
  });

  it('should format negative numbers correctly', () => {
    expect(formatNumber(-1)).toBe('-1');
    expect(formatNumber(-1234)).toBe(`-1${NBSP}234`);
    expect(formatNumber(-123.45)).toBe('-123');
    expect(formatNumber(-123.45, 2)).toBe('-123,45');
    expect(formatNumber(-1.5)).toBe('-2');
    expect(formatNumber(-1.5, 1)).toBe('-1,5');
  });

  it('should format large numbers correctly', () => {
    expect(formatNumber(1000000)).toBe(`1${NBSP}000${NBSP}000`);
    expect(formatNumber(1000000000)).toBe(`1${NBSP}000${NBSP}000${NBSP}000`);
    expect(formatNumber(1000000.5, 1)).toBe(`1${NBSP}000${NBSP}000,5`);
  });
});
