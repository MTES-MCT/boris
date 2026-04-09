import { API_URL, API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import cache, { namespaces, TTL_MS } from '$lib/server/cache';

export const GET = async () => {
  let eligibilitySimulationsByDepartements = await cache.get(
    namespaces.eligibilitySimulationsByDepartements,
  );

  if (!eligibilitySimulationsByDepartements) {
    const response = await fetch(
      `${API_URL}/eligibility-simulations/simulations/by-departements`,
      {
        headers: {
          'x-api-key': API_KEY,
        },
      },
    );

    eligibilitySimulationsByDepartements = await response.json();

    cache.set(
      namespaces.eligibilitySimulationsByDepartements,
      eligibilitySimulationsByDepartements,
      TTL_MS,
    );
  }

  return json(eligibilitySimulationsByDepartements);
};
