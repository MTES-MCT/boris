import { API_URL, API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import cache, { namespaces, TTL_MS } from '$lib/server/cache';

export const GET = async () => {
  let eligibilitySimulationsByRegions = await cache.get(
    namespaces.eligibilitySimulationsByRegions,
  );

  if (!eligibilitySimulationsByRegions) {
    const response = await fetch(
      `${API_URL}/eligibility-simulations/simulations/by-regions`,
      {
        headers: {
          'x-api-key': API_KEY,
        },
      },
    );

    eligibilitySimulationsByRegions = await response.json();

    cache.set(
      namespaces.eligibilitySimulationsByRegions,
      eligibilitySimulationsByRegions,
      TTL_MS,
    );
  }

  return json(eligibilitySimulationsByRegions);
};
