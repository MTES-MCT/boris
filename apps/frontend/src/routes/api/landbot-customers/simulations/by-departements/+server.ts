import { API_URL, API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import cache, { namespaces, TTL_MS } from '$lib/server/cache';

export const GET = async () => {
  let landbotCustomersSimulationsByDepartements = await cache.get(
    namespaces.landbotCustomersSimulationsByDepartements,
  );

  if (!landbotCustomersSimulationsByDepartements) {
    const response = await fetch(
      `${API_URL}/landbot-customers/simulations/by-departements`,
      {
        headers: {
          'x-api-key': API_KEY,
        },
      },
    );

    landbotCustomersSimulationsByDepartements = await response.json();

    cache.set(
      namespaces.landbotCustomersSimulationsByDepartements,
      landbotCustomersSimulationsByDepartements,
      TTL_MS,
    );
  }

  return json(landbotCustomersSimulationsByDepartements);
};
