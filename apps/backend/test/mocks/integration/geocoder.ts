import { GeocodedResponse } from 'src/infrastructure/geocoder/types';

export const mockedGeocodedResponse: GeocodedResponse = {
  type: 'Feature',
  geometry: { type: 'Point', coordinates: [-2.752192, 47.659971] },
  properties: {
    label: 'Vannes',
    score: 0.9537081818181818,
    id: '56260',
    type: 'municipality',
    name: 'Vannes',
    postcode: '56000',
    citycode: '56260',
    x: 268633.41,
    y: 6744561.64,
    city: 'Vannes',
    context: '56, Morbihan, Bretagne',
    importance: 0.49079,
    _type: 'address',
  },
};

export const mockedGeocoderService = {
  geocodeByMunicipality: jest.fn(),
};
