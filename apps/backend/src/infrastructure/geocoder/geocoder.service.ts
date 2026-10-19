import { Injectable } from '@nestjs/common';
import { GeocodedResponse, GeocodedSearchApiResponse } from './types';
import { GeocoderServiceInterface } from 'src/domain/geocoder/geocoder.service.interface';

@Injectable()
export class GeocoderService implements GeocoderServiceInterface {
  public baseUrl = 'https://data.geopf.fr/geocodage';

  constructor() {}

  public async geocodeByAddress(
    address: string,
    inseeCode?: string,
  ): Promise<GeocodedResponse[]> {
    try {
      let url = `${this.baseUrl}/search?q=${encodeURIComponent(address)}&autocomplete=0&index=address&limit=1&returntruegeometry=false`;

      if (inseeCode) {
        url = `${url}&citycode=${encodeURIComponent(inseeCode)}`;
      }

      const response = await fetch(url);
      const data: GeocodedSearchApiResponse = await response.json();

      return data?.features || [];
    } catch (e) {
      console.log(`An error occured while geocoding ${address}`);
      throw e;
    }
  }

  public async geocodeByMunicipality(
    municipality: string,
    inseeCode?: string,
  ): Promise<GeocodedResponse[]> {
    try {
      let url = `${this.baseUrl}/search?q=${encodeURIComponent(municipality)}&autocomplete=1&index=address&limit=5&returntruegeometry=false&type=municipality`;

      if (inseeCode) {
        url = `${url}&citycode=${encodeURIComponent(inseeCode)}`;
      }

      const response = await fetch(url);
      const data: GeocodedSearchApiResponse = await response.json();

      return data?.features || [];
    } catch (e) {
      console.log(`An error occured while geocoding ${municipality}`);
      throw e;
    }
  }

  public geocodedResultHasMunicipalityDoublon(
    geocodedResult: GeocodedResponse[],
    city: string,
  ): boolean {
    const normalize = (name: string) =>
      name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');
    const matchingResults = geocodedResult.filter(
      (result) => normalize(result.properties?.city || '') === normalize(city),
    );

    return matchingResults.length > 1;
  }
}
