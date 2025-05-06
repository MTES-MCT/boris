import { finistere, paris } from 'test/mocks/departement';
import { ofs1 } from 'test/mocks/ofs';
import { bretagne } from 'test/mocks/region';

describe('Ofs', () => {
  it('getters', () => {
    expect(ofs1.name).toBe('La foncière de Bretagne');
    expect(ofs1.phone).toBe('0203040506');
    expect(ofs1.websiteUrl).toBe('https://boris.beta.gouv.fr');
    expect(ofs1.departements).toStrictEqual([finistere, paris]);
    expect(ofs1.regions).toStrictEqual([bretagne]);
  });

  it('setters', () => {
    ofs1.name = 'La foncière bretonne';
    ofs1.phone = '0203040507';
    ofs1.websiteUrl = 'https://boris.incubateur.net';
    ofs1.departements = [paris];
    ofs1.regions = [];

    expect(ofs1.name).toBe('La foncière bretonne');
    expect(ofs1.phone).toBe('0203040507');
    expect(ofs1.websiteUrl).toBe('https://boris.incubateur.net');
    expect(ofs1.departements).toStrictEqual([paris]);
    expect(ofs1.regions).toStrictEqual([]);
  });
});
