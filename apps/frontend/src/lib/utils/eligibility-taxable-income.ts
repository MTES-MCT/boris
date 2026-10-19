import z from 'zod';
import { formattedThousandsToNumber, formatThousands } from './formatters';

export const coBuyerTaxableIncomeSchema = (message: string) =>
  z.string(message).refine((value) => {
    return (
      /^\d[\d\s]*(,\d+)?$/.test(value.trim()) &&
      formattedThousandsToNumber(value) >= 0
    );
  }, message);

// Preserve empty and invalid input: the general formatter turns both into zero.
export const formatCoBuyerTaxableIncome = (value: string) =>
  /\d/.test(value) && /^[\d\s,€]+$/.test(value)
    ? formatThousands(value)
    : value;
