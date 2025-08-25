import type { AutocompleteResponse } from '$lib/utils/ign-types';

const API_URL = 'https://data.geopf.fr/geocodage/completion/';

export const autocomplete = async (
  query: string,
): Promise<AutocompleteResponse> => {
  console.log(query);

  if (!query) {
    return {
      status: 200,
      results: [],
    };
  }

  const url = new URL(API_URL);
  url.searchParams.set('text', query);
  url.searchParams.set('maximumResponses', '5');

  const response = await fetch(url);
  const data: AutocompleteResponse = await response.json();

  return data;
};
