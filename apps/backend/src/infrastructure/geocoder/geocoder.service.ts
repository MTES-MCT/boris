import { Injectable } from '@nestjs/common';
import { GeocodedResponse, GeocodedSearchApiResponse } from './types';
import { GeocoderServiceInterface } from 'src/domain/geocoder/geocoder.service.interface';

@Injectable()
export class GeocoderService implements GeocoderServiceInterface {
  public baseUrl = 'https://data.geopf.fr/geocodage';

  constructor() {}

  public async geocodeByMunicipality(
    municipality: string,
    inseeCode?: string,
  ): Promise<GeocodedResponse[]> {
    try {
      let url = `${this.baseUrl}/search?q=${municipality}&autocomplete=0&index=address&limit=5&returntruegeometry=false&type=municipality`;

      if (inseeCode) {
        url = `${url}&citycode=${inseeCode}`;
      }

      const response = await fetch(url);
      const data: GeocodedSearchApiResponse = await response.json();

      return data?.features;
    } catch (e) {
      console.log(`An error occured while geocoding ${municipality}`);
      throw e;
    }
  }

  public geocodedResultHasMunicipalityDoublon(
    geocodedResult: GeocodedResponse[],
    city: string,
  ): boolean {
    const matchingResults = geocodedResult.filter(
      (geocodedResult) => geocodedResult.properties?.city === city,
    );

    return matchingResults.length > 1;
  }
}
