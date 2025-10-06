import type {
  GeocodedResponse,
  GeocodedSearchApiResponse,
} from '$lib/utils/definitions';

const API_URL = 'https://data.geopf.fr/geocodage';

export const autocomplete = async (
  query: string,
  maximumResponses: string,
): Promise<GeocodedResponse[]> => {
  const urlSearch = new URL(`${API_URL}/search`);
  urlSearch.searchParams.set('q', query);
  urlSearch.searchParams.set('limit', maximumResponses || '5');
  urlSearch.searchParams.set('returntruegeometry', 'false');
  urlSearch.searchParams.set('index', 'address');

  const searchResponse = await fetch(urlSearch);
  const searchData: GeocodedSearchApiResponse = await searchResponse.json();

  if (!query) {
    return [];
  }

  return searchData.features;
};

export const reverse = async (latitude: string, longitude: string) => {
  const url = new URL(`${API_URL}/reverse`);
  url.searchParams.set('lat', latitude.toString());
  url.searchParams.set('lon', longitude.toString());
  url.searchParams.set('limit', '1');
  url.searchParams.set('returntruegeometry', 'false');

  const response = await fetch(url);
  const data = await response.json();

  return data;
};
