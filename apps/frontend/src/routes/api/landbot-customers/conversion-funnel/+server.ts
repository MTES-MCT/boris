import { API_URL, API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import cache, { namespaces, TTL_MS } from '$lib/server/cache';

export const GET = async () => {
  let landbotCustomersConversionFunnel = await cache.get(
    namespaces.landbotCustomersConversionFunnel,
  );

  if (!landbotCustomersConversionFunnel) {
    const response = await fetch(
      `${API_URL}/landbot-customers/conversion-funnel`,
      {
        headers: {
          'x-api-key': API_KEY,
        },
      },
    );

    landbotCustomersConversionFunnel = await response.json();

    cache.set(
      namespaces.landbotCustomersConversionFunnel,
      landbotCustomersConversionFunnel,
      TTL_MS,
    );
  }

  return json(landbotCustomersConversionFunnel);
};
