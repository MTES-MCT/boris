import { finistere } from 'test/mocks/departement';
import { bretagne, ileDeFrance } from 'test/mocks/region';

describe('DepartementEntity', () => {
  it('getters', () => {
    expect(finistere.name).toBe('Finistère');
    expect(finistere.code).toBe('29');
    expect(finistere.region).toBe(bretagne);
  });

  it('setters', () => {
    finistere.name = 'Penn ar bed';
    finistere.code = '0';
    finistere.region = ileDeFrance;

    expect(finistere.name).toBe('Penn ar bed');
    expect(finistere.code).toBe('0');
    expect(finistere.region).toBe(ileDeFrance);
  });
});
