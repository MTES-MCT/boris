import { describe, it, expect } from 'vitest';
import {
  defineCategory,
  defineEligibleZone,
} from '$lib/utils/eligibility-simulator';

describe('eligibility-simulator', () => {
  describe('defineCategory', () => {
    it('should be category 1', () => {
      const householdSize = 1;
      const dependantsAmount = 0;
      const hasDisability = false;
      expect(
        defineCategory(householdSize, hasDisability, dependantsAmount),
      ).toBe(1);
    });

    it('should be category 2', () => {
      let householdSize = 2;
      const dependantsAmount = 0;
      let hasDisability = false;
      const birthday = '1950-01-01';
      const coBuyerBirthday = '1950-01-01';
      expect(
        defineCategory(
          householdSize,
          hasDisability,
          dependantsAmount,
          birthday,
          coBuyerBirthday,
        ),
      ).toBe(2);

      householdSize = 1;
      hasDisability = true;
      expect(
        defineCategory(
          householdSize,
          hasDisability,
          dependantsAmount,
          birthday,
          coBuyerBirthday,
        ),
      ).toBe(2);
    });

    it('should be category 3', () => {
      let householdSize = 3;
      let dependantsAmount = 0;
      let hasDisability = false;
      let birthday = '1950-01-01';
      let coBuyerBirthday = '1950-01-01';
      expect(
        defineCategory(
          householdSize,
          hasDisability,
          dependantsAmount,
          birthday,
          coBuyerBirthday,
        ),
      ).toBe(3);

      householdSize = 2;
      dependantsAmount = 1;
      expect(
        defineCategory(
          householdSize,
          hasDisability,
          dependantsAmount,
          birthday,
          coBuyerBirthday,
        ),
      ).toBe(3);

      hasDisability = true;
      expect(
        defineCategory(
          householdSize,
          hasDisability,
          dependantsAmount,
          birthday,
          coBuyerBirthday,
        ),
      ).toBe(3);

      birthday = '2010-01-01';
      coBuyerBirthday = '2010-01-01';
      expect(
        defineCategory(
          householdSize,
          hasDisability,
          dependantsAmount,
          birthday,
          coBuyerBirthday,
        ),
      ).toBe(3);
    });

    it('should be category 4', () => {
      let householdSize = 4;
      let dependantsAmount = 0;
      let hasDisability = false;
      expect(
        defineCategory(householdSize, hasDisability, dependantsAmount),
      ).toBe(4);

      householdSize = 3;
      dependantsAmount = 2;
      expect(
        defineCategory(householdSize, hasDisability, dependantsAmount),
      ).toBe(4);

      hasDisability = true;
      expect(
        defineCategory(householdSize, hasDisability, dependantsAmount),
      ).toBe(4);
    });

    it('should be category 5', () => {
      let householdSize = 5;
      let dependantsAmount = 0;
      let hasDisability = false;
      expect(
        defineCategory(householdSize, hasDisability, dependantsAmount),
      ).toBe(5);

      householdSize = 4;
      dependantsAmount = 3;
      expect(
        defineCategory(householdSize, hasDisability, dependantsAmount),
      ).toBe(5);

      hasDisability = true;
      expect(
        defineCategory(householdSize, hasDisability, dependantsAmount),
      ).toBe(5);
    });

    it('should be category 6', () => {
      let householdSize = 6;
      let dependantsAmount = 0;
      let hasDisability = false;
      expect(
        defineCategory(householdSize, hasDisability, dependantsAmount),
      ).toBe(6);

      householdSize = 5;
      dependantsAmount = 4;
      expect(
        defineCategory(householdSize, hasDisability, dependantsAmount),
      ).toBe(6);

      hasDisability = true;
      expect(
        defineCategory(householdSize, hasDisability, dependantsAmount),
      ).toBe(6);

      householdSize = 10;
      expect(
        defineCategory(householdSize, hasDisability, dependantsAmount),
      ).toBe(6);
    });
  });

  describe('defineEligibleZone', () => {
    describe('Category 1', () => {
      const householdSize = 1;
      const dependantsAmount = 0;
      const hasDisability = false;

      it('should be elibile all zones', () => {
        const taxableIncome = 30000;

        expect(
          defineEligibleZone(
            taxableIncome,
            householdSize,
            hasDisability,
            dependantsAmount,
          ),
        ).toStrictEqual({
          category: 1,
          eligibleZoneAandAbis: true,
          eligibleZoneB1: true,
          eligibleZoneB2andC: true,
        });
      });

      it('should be eligible zone A, A bis and B1', () => {
        const taxableIncome = 38000;
        expect(
          defineEligibleZone(
            taxableIncome,
            householdSize,
            hasDisability,
            dependantsAmount,
          ),
        ).toStrictEqual({
          category: 1,
          eligibleZoneAandAbis: true,
          eligibleZoneB1: true,
          eligibleZoneB2andC: false,
        });
      });

      it('should not be eligible in any zone', () => {
        const taxableIncome = 100000;
        expect(
          defineEligibleZone(
            taxableIncome,
            householdSize,
            hasDisability,
            dependantsAmount,
          ),
        ).toStrictEqual({
          category: 1,
          eligibleZoneAandAbis: false,
          eligibleZoneB1: false,
          eligibleZoneB2andC: false,
        });
      });
    });

    describe('Category 2', () => {
      const householdSize = 2;
      const dependantsAmount = 0;
      const hasDisability = false;
      const birthday = '1950-01-01';
      const coBuyerBirthday = '1950-01-01';
      it('should be elibile all zones', () => {
        const taxableIncome = 38000;
        expect(
          defineEligibleZone(
            taxableIncome,
            householdSize,
            hasDisability,
            dependantsAmount,
            birthday,
            coBuyerBirthday,
          ),
        ).toStrictEqual({
          category: 2,
          eligibleZoneAandAbis: true,
          eligibleZoneB1: true,
          eligibleZoneB2andC: true,
        });
        expect(
          defineEligibleZone(
            taxableIncome,
            1,
            true,
            dependantsAmount,
            birthday,
            coBuyerBirthday,
          ),
        ).toStrictEqual({
          category: 2,
          eligibleZoneAandAbis: true,
          eligibleZoneB1: true,
          eligibleZoneB2andC: true,
        });
      });

      it('should be eligible zone A, A bis and B1', () => {
        const taxableIncome = 58000;
        expect(
          defineEligibleZone(
            taxableIncome,
            householdSize,
            hasDisability,
            dependantsAmount,
            birthday,
            coBuyerBirthday,
          ),
        ).toStrictEqual({
          category: 2,
          eligibleZoneAandAbis: true,
          eligibleZoneB1: true,
          eligibleZoneB2andC: false,
        });
        expect(
          defineEligibleZone(
            taxableIncome,
            1,
            true,
            dependantsAmount,
            birthday,
            coBuyerBirthday,
          ),
        ).toStrictEqual({
          category: 2,
          eligibleZoneAandAbis: true,
          eligibleZoneB1: true,
          eligibleZoneB2andC: false,
        });
      });

      it('should not be eligible in any zone', () => {
        const taxableIncome = 100000;
        expect(
          defineEligibleZone(
            taxableIncome,
            householdSize,
            hasDisability,
            dependantsAmount,
            birthday,
            coBuyerBirthday,
          ),
        ).toStrictEqual({
          category: 2,
          eligibleZoneAandAbis: false,
          eligibleZoneB1: false,
          eligibleZoneB2andC: false,
        });
      });
    });

    describe('Category 3', () => {
      const householdSize = 3;
      const dependantsAmount = 0;
      const hasDisability = false;
      const birthday = '1950-01-01';
      const coBuyerBirthday = '1950-01-01';
      it('should be elibile all zones', () => {
        const taxableIncome = 38000;
        expect(
          defineEligibleZone(
            taxableIncome,
            householdSize,
            hasDisability,
            dependantsAmount,
            birthday,
            coBuyerBirthday,
          ),
        ).toStrictEqual({
          category: 3,
          eligibleZoneAandAbis: true,
          eligibleZoneB1: true,
          eligibleZoneB2andC: true,
        });
        expect(
          defineEligibleZone(
            taxableIncome,
            1,
            true,
            dependantsAmount,
            birthday,
            coBuyerBirthday,
          ),
        ).toStrictEqual({
          category: 2,
          eligibleZoneAandAbis: true,
          eligibleZoneB1: true,
          eligibleZoneB2andC: true,
        });
      });

      it('should be eligible zone A, A bis', () => {
        const taxableIncome = 76000;
        expect(
          defineEligibleZone(
            taxableIncome,
            householdSize,
            hasDisability,
            dependantsAmount,
            birthday,
            coBuyerBirthday,
          ),
        ).toStrictEqual({
          category: 3,
          eligibleZoneAandAbis: true,
          eligibleZoneB1: false,
          eligibleZoneB2andC: false,
        });
        expect(
          defineEligibleZone(
            taxableIncome,
            2,
            true,
            dependantsAmount,
            birthday,
            coBuyerBirthday,
          ),
        ).toStrictEqual({
          category: 3,
          eligibleZoneAandAbis: true,
          eligibleZoneB1: false,
          eligibleZoneB2andC: false,
        });
      });

      it('should not be eligible in any zone', () => {
        const taxableIncome = 100000;
        expect(
          defineEligibleZone(
            taxableIncome,
            householdSize,
            hasDisability,
            dependantsAmount,
            birthday,
            coBuyerBirthday,
          ),
        ).toStrictEqual({
          category: 3,
          eligibleZoneAandAbis: false,
          eligibleZoneB1: false,
          eligibleZoneB2andC: false,
        });
      });
    });
  });
});
