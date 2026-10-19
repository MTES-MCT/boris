import { describe, expect, it } from 'vitest';
import {
  coBuyerTaxableIncomeSchema,
  formatCoBuyerTaxableIncome,
} from '$lib/utils/eligibility-taxable-income';
import { formattedThousandsToNumber } from '$lib/utils/formatters';
import z from 'zod';

const schema = z.object({
  first: coBuyerTaxableIncomeSchema('RFR invalide'),
  second: coBuyerTaxableIncomeSchema('RFR invalide'),
});

describe('separate co-buyer taxable incomes', () => {
  it.each([
    ['25 000', '0'],
    ['0', '25 000'],
    ['0', '0'],
  ])(
    'accepts %s and %s and preserves zero in the household total',
    (first, second) => {
      const result = schema.parse({
        first: formatCoBuyerTaxableIncome(first),
        second: formatCoBuyerTaxableIncome(second),
      });
      expect(
        formattedThousandsToNumber(result.first) +
          formattedThousandsToNumber(result.second),
      ).toBe(first === '0' && second === '0' ? 0 : 25000);
    },
  );

  it.each([undefined, '', '   ', '-1', 'abc', 'NaN', '€', ','])(
    'rejects an absent or invalid RFR: %s',
    (value) => {
      const formatted =
        value === undefined ? value : formatCoBuyerTaxableIncome(value);
      expect(
        schema.safeParse({ first: '25 000', second: formatted }).success,
      ).toBe(false);
      expect(
        schema.safeParse({ first: formatted, second: '25 000' }).success,
      ).toBe(false);
    },
  );
});
