import { API_URL, API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import cache, { namespaces, TTL_MS } from '$lib/server/cache';

export const GET = async () => {
  let acquisitionSimulationsConversionFunnel = await cache.get(
    namespaces.acquisitionSimulationsConversionFunnel,
  );

  if (!acquisitionSimulationsConversionFunnel) {
    const response = await fetch(
      `${API_URL}/acquisition-simulations/conversion-funnel`,
      {
        headers: {
          'x-api-key': API_KEY,
        },
      },
    );

    acquisitionSimulationsConversionFunnel = await response.json();

    cache.set(
      namespaces.acquisitionSimulationsConversionFunnel,
      acquisitionSimulationsConversionFunnel,
      TTL_MS,
    );
  }

  return json(acquisitionSimulationsConversionFunnel);
};
