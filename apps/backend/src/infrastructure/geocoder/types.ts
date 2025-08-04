import { components, operations } from './generated-address-datagouv-types';

export type GeocodedResponse = components['schemas']['Address'];
export type GeocodedSearchApiResponse =
  operations['search']['responses']['200']['content']['application/json'] & {
    features: GeocodedResponse[];
  };
