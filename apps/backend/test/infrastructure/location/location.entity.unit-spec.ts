import { mockedLocation } from 'test/mocks/integration/location';
import { finistere, paris } from 'test/mocks/integration/departement';

describe('LocationEntity', () => {
  it('getters', () => {
    expect(mockedLocation.latitude).toBe(48.3905);
    expect(mockedLocation.longitude).toBe(-4.486);
    expect(mockedLocation.city).toBe('Brest');
    expect(mockedLocation.citycode).toBe('29019');
    expect(mockedLocation.label).toBe('Brest');
    expect(mockedLocation.municipality).toBe('Brest');
    expect(mockedLocation.postalCode).toBe('29200');
    expect(mockedLocation.departement).toBe(finistere);
    expect(mockedLocation.createdAt).toEqual(new Date('2024-01-15'));
    expect(mockedLocation.updatedAt).toEqual(new Date('2024-01-15'));
  });

  it('setters', () => {
    const newDate = new Date('2024-02-20');
    mockedLocation.latitude = 48.8566;
    mockedLocation.longitude = 2.3522;
    mockedLocation.city = 'Paris';
    mockedLocation.citycode = '75156';
    mockedLocation.label = 'Paris';
    mockedLocation.municipality = 'Paris';
    mockedLocation.postalCode = '75001';
    mockedLocation.departement = paris;
    mockedLocation.createdAt = newDate;
    mockedLocation.updatedAt = newDate;

    expect(mockedLocation.latitude).toBe(48.8566);
    expect(mockedLocation.longitude).toBe(2.3522);
    expect(mockedLocation.city).toBe('Paris');
    expect(mockedLocation.citycode).toBe('75156');
    expect(mockedLocation.label).toBe('Paris');
    expect(mockedLocation.municipality).toBe('Paris');
    expect(mockedLocation.postalCode).toBe('75001');
    expect(mockedLocation.departement).toBe(paris);
    expect(mockedLocation.createdAt).toEqual(newDate);
    expect(mockedLocation.updatedAt).toEqual(newDate);
  });
});
