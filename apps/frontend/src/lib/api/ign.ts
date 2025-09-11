import type { AutocompleteResponse } from '$lib/utils/definitions';

const API_URL = 'https://data.geopf.fr/geocodage';

export const autocomplete = async (
  query: string,
  maximumResponses: string,
): Promise<AutocompleteResponse> => {
  if (!query) {
    return {
      status: 200,
      results: [],
    };
  }

  const url = new URL(`${API_URL}/completion/`);
  url.searchParams.set('text', query);
  url.searchParams.set('maximumResponses', maximumResponses || '5');

  const response = await fetch(url);
  const data: AutocompleteResponse = await response.json();

  return data;
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
