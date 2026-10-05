import type { UpdateEligibilitySimulationDto } from './api-types';
import type { GeocodedResponse } from './definitions';

export function toEligibilitySimulationLocation(
  location: GeocodedResponse['properties'],
): NonNullable<UpdateEligibilitySimulationDto['locations']>[number] {
  return {
    name: location?.name,
    city: location?.city,
    citycode: location?.citycode,
    label: location?.label,
    latitude: location?.y,
    longitude: location?.x,
    postalCode: location?.postcode,
  };
}
