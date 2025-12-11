import { API_URL, API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import cache, { namespaces, TTL_MS } from '$lib/server/cache';

export const GET = async () => {
  let landbotCustomersSimulationsMonthlySummary = await cache.get(
    namespaces.landbotCustomersSimulationsMonthlySummary,
  );

  if (!landbotCustomersSimulationsMonthlySummary) {
    const response = await fetch(
      `${API_URL}/landbot-customers/simulations/monthly-summary`,
      {
        headers: {
          'x-api-key': API_KEY,
        },
      },
    );

    landbotCustomersSimulationsMonthlySummary = await response.json();

    cache.set(
      namespaces.landbotCustomersSimulationsMonthlySummary,
      landbotCustomersSimulationsMonthlySummary,
      TTL_MS,
    );
  }

  return json(landbotCustomersSimulationsMonthlySummary);
};
