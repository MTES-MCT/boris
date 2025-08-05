import { GeocodedResponse } from 'src/infrastructure/geocoder/types';

export interface GeocoderServiceInterface {
  geocodeByMunicipality(
    municipality: string,
  ): Promise<GeocodedResponse | undefined>;
  getZipcodeFirstTwoDigits(zipcode: string): string;
}
