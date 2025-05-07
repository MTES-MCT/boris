import { distributor1 } from 'test/mocks/distributor';
import { ofs1 } from 'test/mocks/ofs';

describe('DistributorEntity', () => {
  it('getters', () => {
    expect(distributor1.name).toBe('Commercialisateur de bretagne');
    expect(distributor1.websiteUrl).toBe('https://boris.beta.gouv.fr');
    expect(distributor1.ofss).toStrictEqual([]);
  });

  it('setters', () => {
    distributor1.name = 'Penn ar bed';
    distributor1.websiteUrl = 'https://boris.incubateur.net';
    distributor1.ofss = [ofs1];

    expect(distributor1.name).toBe('Penn ar bed');
    expect(distributor1.websiteUrl).toBe('https://boris.incubateur.net');
    expect(distributor1.ofss).toStrictEqual([ofs1]);
  });
});
