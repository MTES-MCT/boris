import { API_URL, API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import cache, { namespaces, TTL_MS } from '$lib/server/cache';

export const GET = async () => {
  let eligibilitySimulationsMonthlySummary = await cache.get(
    namespaces.eligibilitySimulationsMonthlySummary,
  );

  if (!eligibilitySimulationsMonthlySummary) {
    const response = await fetch(
      `${API_URL}/eligibility-simulations/simulations/monthly-summary`,
      {
        headers: {
          'x-api-key': API_KEY,
        },
      },
    );

    eligibilitySimulationsMonthlySummary = await response.json();

    cache.set(
      namespaces.eligibilitySimulationsMonthlySummary,
      eligibilitySimulationsMonthlySummary,
      TTL_MS,
    );
  }

  return json(eligibilitySimulationsMonthlySummary);
};
