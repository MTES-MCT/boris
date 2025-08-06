import { Test, TestingModule } from '@nestjs/testing';
import { GeocoderService } from 'src/infrastructure/geocoder/geocoder.service';
import { mockedGeocodedResponse } from 'test/mocks/integration/geocoder';
import { GeocodedSearchApiResponse } from 'src/infrastructure/geocoder/types';

global.fetch = jest.fn();

describe('GeocoderService', () => {
  let geocoderService: GeocoderService;
  let mockFetch: jest.MockedFunction<typeof fetch>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeocoderService],
    }).compile();

    geocoderService = module.get<GeocoderService>(GeocoderService);
    mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
  });

  it('should have correct baseUrl', () => {
    expect(geocoderService.baseUrl).toBe('https://data.geopf.fr/geocodage');
  });

  it('should return the first feature when geocoding is successful', async () => {
    const municipality = 'Paris';
    const expectedUrl = `${geocoderService.baseUrl}/search?q=${municipality}&autocomplete=0&index=address&limit=1&returntruegeometry=false&type=municipality`;

    const mockApiResponse: GeocodedSearchApiResponse = {
      type: 'FeatureCollection',
      features: [mockedGeocodedResponse],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockApiResponse),
    } as unknown as Response);

    const result = await geocoderService.geocodeByMunicipality(municipality);

    expect(mockFetch).toHaveBeenCalledWith(expectedUrl);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockedGeocodedResponse);
  });

  it('should return undefined when no features are found', async () => {
    const municipality = 'NonExistentCity';
    const emptyResponse: GeocodedSearchApiResponse = {
      type: 'FeatureCollection',
      features: [],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(emptyResponse),
    } as unknown as Response);

    const result = await geocoderService.geocodeByMunicipality(municipality);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(result).toBeUndefined();
  });

  it('should return the first two digits of the zipcode', () => {
    const zipcode = '75001';
    const result = geocoderService.getZipcodeFirstTwoDigits(zipcode);
    expect(result).toBe('75');
  });
});
