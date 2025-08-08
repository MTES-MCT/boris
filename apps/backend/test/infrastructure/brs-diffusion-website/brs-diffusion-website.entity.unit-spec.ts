import { bretagne, ileDeFrance } from 'test/mocks/integration/region';
import { mockedBrsDiffusionWebsite } from 'test/mocks/integration/brs-diffusion-website';
import { finistere, paris } from 'test/mocks/integration/departement';

describe('BrsDiffusionWebsiteEntity', () => {
  it('getters', () => {
    expect(mockedBrsDiffusionWebsite.source).toBe('https://source.fr');
    expect(mockedBrsDiffusionWebsite.distributorName).toBe('Commercialisateur');
    expect(mockedBrsDiffusionWebsite.ofsName).toBe('OFS');
    expect(mockedBrsDiffusionWebsite.city).toBe('Quimper');
    expect(mockedBrsDiffusionWebsite.zipcode).toBe('29000');
    expect(mockedBrsDiffusionWebsite.address).toBe('29, Finistère, Bretagne');
    expect(mockedBrsDiffusionWebsite.inseeCode).toBe('29');
    expect(mockedBrsDiffusionWebsite.latitude).toBe(48.111111);
    expect(mockedBrsDiffusionWebsite.longitude).toBe(4.111111);
    expect(mockedBrsDiffusionWebsite.region).toBe(bretagne);
    expect(mockedBrsDiffusionWebsite.departement).toBe(finistere);
  });

  it('setters', () => {
    mockedBrsDiffusionWebsite.source = 'https://source.com';
    mockedBrsDiffusionWebsite.distributorName = 'Commercialisateur 2';
    mockedBrsDiffusionWebsite.ofsName = 'OFS 2';
    mockedBrsDiffusionWebsite.city = 'Quimper 2';
    mockedBrsDiffusionWebsite.zipcode = '29000 2';
    mockedBrsDiffusionWebsite.address = '29, Finistère, Bretagne 2';
    mockedBrsDiffusionWebsite.inseeCode = '29 2';
    mockedBrsDiffusionWebsite.latitude = 48.111111;
    mockedBrsDiffusionWebsite.longitude = 4.111111;
    mockedBrsDiffusionWebsite.region = ileDeFrance;
    mockedBrsDiffusionWebsite.departement = paris;

    expect(mockedBrsDiffusionWebsite.source).toBe('https://source.com');
    expect(mockedBrsDiffusionWebsite.distributorName).toBe(
      'Commercialisateur 2',
    );
    expect(mockedBrsDiffusionWebsite.ofsName).toBe('OFS 2');
    expect(mockedBrsDiffusionWebsite.city).toBe('Quimper 2');
    expect(mockedBrsDiffusionWebsite.zipcode).toBe('29000 2');
    expect(mockedBrsDiffusionWebsite.address).toBe('29, Finistère, Bretagne 2');
    expect(mockedBrsDiffusionWebsite.inseeCode).toBe('29 2');
    expect(mockedBrsDiffusionWebsite.latitude).toBe(48.111111);
    expect(mockedBrsDiffusionWebsite.longitude).toBe(4.111111);
    expect(mockedBrsDiffusionWebsite.region).toBe(ileDeFrance);
    expect(mockedBrsDiffusionWebsite.departement).toBe(paris);
  });
});
