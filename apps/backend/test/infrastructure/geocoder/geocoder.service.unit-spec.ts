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

  it('should return features when geocoding is successful', async () => {
    const municipality = 'Paris';
    const url = `${geocoderService.baseUrl}/search?q=${municipality}&autocomplete=0&index=address&limit=5&returntruegeometry=false&type=municipality`;

    const mockApiResponse: GeocodedSearchApiResponse = {
      type: 'FeatureCollection',
      features: [mockedGeocodedResponse],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockApiResponse),
    } as unknown as Response);

    const result = await geocoderService.geocodeByMunicipality(municipality);

    expect(mockFetch).toHaveBeenCalledWith(url);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(result).toEqual([mockedGeocodedResponse]);
  });

  it('should return features when geocoding with inseeCode is successful ', async () => {
    const municipality = 'Paris';
    const inseeCode = '12345';
    const url = `${geocoderService.baseUrl}/search?q=${municipality}&autocomplete=0&index=address&limit=5&returntruegeometry=false&type=municipality&citycode=${inseeCode}`;

    const mockApiResponse: GeocodedSearchApiResponse = {
      type: 'FeatureCollection',
      features: [mockedGeocodedResponse],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockApiResponse),
    } as unknown as Response);

    const result = await geocoderService.geocodeByMunicipality(
      municipality,
      inseeCode,
    );

    expect(mockFetch).toHaveBeenCalledWith(url);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(result).toEqual([mockedGeocodedResponse]);
  });

  it('should return empty array when no features are found', async () => {
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
    expect(result).toHaveLength(0);
  });

  it('should find city doublon', () => {
    const hasDoublon = geocoderService.geocodedResultHasMunicipalityDoublon(
      [mockedGeocodedResponse, mockedGeocodedResponse],
      mockedGeocodedResponse.properties?.city as string,
    );

    expect(hasDoublon).toBeTruthy();
  });

  it('should not find city doublon', () => {
    const hasDoublon = geocoderService.geocodedResultHasMunicipalityDoublon(
      [mockedGeocodedResponse, mockedGeocodedResponse],
      'OtherCity',
    );

    expect(hasDoublon).toBeFalsy();
  });
});
