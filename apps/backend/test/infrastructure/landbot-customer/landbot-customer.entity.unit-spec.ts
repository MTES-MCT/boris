import { mockedLandbotCustomer } from 'test/mocks/integration/landbot-customer';
import { finistere, paris } from 'test/mocks/integration/departement';
import {
  LandbotBrsKnowledge,
  LandbotEligibility,
  LandbotRealEstateSituation,
} from 'src/domain/landbot-customer/landbot-customer.interface';
import { LandbotCustomerEntity } from 'src/infrastructure/landbot-customer/landbot-customer.entity';

describe('LandbotCustomerEntity', () => {
  it('getters', () => {
    expect(mockedLandbotCustomer.date).toEqual(new Date('2024-01-15'));
    expect(mockedLandbotCustomer.desiredCity).toBe('Paris');
    expect(mockedLandbotCustomer.departement).toBe(finistere);
    expect(mockedLandbotCustomer.eligibility).toBe(
      LandbotEligibility.ZONE_TENDUE,
    );
    expect(mockedLandbotCustomer.brsKnowledge).toBe(LandbotBrsKnowledge.OUI);
    expect(mockedLandbotCustomer.realEstateSituation).toBe(
      LandbotRealEstateSituation.PROPRIETAIRE,
    );
  });

  it('setters', () => {
    const newDate = new Date('2024-02-20');
    const newDesiredCity = 'Lyon';
    mockedLandbotCustomer.date = newDate;
    mockedLandbotCustomer.desiredCity = newDesiredCity;
    mockedLandbotCustomer.departement = paris;
    mockedLandbotCustomer.eligibility = LandbotEligibility.ZONE_TRES_TENDUE;
    mockedLandbotCustomer.brsKnowledge = LandbotBrsKnowledge.NON;
    mockedLandbotCustomer.realEstateSituation =
      LandbotRealEstateSituation.LOCATAIRE_PRIVE;

    expect(mockedLandbotCustomer.date).toEqual(newDate);
    expect(mockedLandbotCustomer.desiredCity).toBe(newDesiredCity);
    expect(mockedLandbotCustomer.departement).toBe(paris);
    expect(mockedLandbotCustomer.eligibility).toBe(
      LandbotEligibility.ZONE_TRES_TENDUE,
    );
    expect(mockedLandbotCustomer.brsKnowledge).toBe(LandbotBrsKnowledge.NON);
    expect(mockedLandbotCustomer.realEstateSituation).toBe(
      LandbotRealEstateSituation.LOCATAIRE_PRIVE,
    );
  });

  it('should allow optional fields to be undefined', () => {
    const customerWithoutOptionalFields = new LandbotCustomerEntity(
      new Date('2024-03-10'),
      undefined,
      finistere,
    );

    expect(customerWithoutOptionalFields.date).toEqual(new Date('2024-03-10'));
    expect(customerWithoutOptionalFields.desiredCity).toBeUndefined();
    expect(customerWithoutOptionalFields.departement).toBe(finistere);
    expect(customerWithoutOptionalFields.eligibility).toBeUndefined();
    expect(customerWithoutOptionalFields.brsKnowledge).toBeUndefined();
    expect(customerWithoutOptionalFields.realEstateSituation).toBeUndefined();
  });
});
