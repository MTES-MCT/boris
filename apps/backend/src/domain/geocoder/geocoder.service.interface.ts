import { GeocodedResponse } from 'src/infrastructure/geocoder/types';

export interface GeocoderServiceInterface {
  geocodeByAddress(address: string): Promise<GeocodedResponse[]>;
  geocodeByMunicipality(
    municipality: string,
    inseeCode?: string,
  ): Promise<GeocodedResponse[]>;
  geocodedResultHasMunicipalityDoublon(
    geocodedResults: GeocodedResponse[],
    city: string,
  ): boolean;
}
