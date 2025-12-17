import { API_URL, API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import cache, { namespaces, TTL_MS } from '$lib/server/cache';

export const GET = async () => {
  let landbotCustomersSimulationsByRegions = await cache.get(
    namespaces.landbotCustomersSimulationsByRegions,
  );

  if (!landbotCustomersSimulationsByRegions) {
    const response = await fetch(
      `${API_URL}/landbot-customers/simulations/by-regions`,
      {
        headers: {
          'x-api-key': API_KEY,
        },
      },
    );

    landbotCustomersSimulationsByRegions = await response.json();

    cache.set(
      namespaces.landbotCustomersSimulationsByRegions,
      landbotCustomersSimulationsByRegions,
      TTL_MS,
    );
  }

  return json(landbotCustomersSimulationsByRegions);
};
