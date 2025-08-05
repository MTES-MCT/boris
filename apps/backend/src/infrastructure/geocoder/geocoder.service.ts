import { Injectable } from '@nestjs/common';
import { GeocodedResponse, GeocodedSearchApiResponse } from './types';
import { GeocoderServiceInterface } from 'src/domain/geocoder/geocoder.service.interface';

@Injectable()
export class GeocoderService implements GeocoderServiceInterface {
  public baseUrl = 'https://data.geopf.fr/geocodage';

  constructor() {}

  public async geocodeByMunicipality(
    municipality: string,
  ): Promise<GeocodedResponse | undefined> {
    const response = await fetch(
      `${this.baseUrl}/search?q=${municipality}&autocomplete=0&index=address&limit=1&returntruegeometry=false&type=municipality`,
    );

    const data: GeocodedSearchApiResponse = await response.json();

    return data?.features?.[0];
  }

  public getZipcodeFirstTwoDigits(zipcode: string): string {
    return zipcode.slice(0, 2);
  }
}
