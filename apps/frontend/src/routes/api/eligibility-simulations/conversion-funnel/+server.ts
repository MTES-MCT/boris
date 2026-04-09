import { API_KEY, API_URL } from '$env/static/private';
import cache, { namespaces, TTL_MS } from '$lib/server/cache';
import { json } from '@sveltejs/kit';

export const GET = async () => {
  let eligibilitySimulationsConversionFunnel = await cache.get(
    namespaces.eligibilitySimulationsConversionFunnel,
  );

  if (!eligibilitySimulationsConversionFunnel) {
    const response = await fetch(
      `${API_URL}/eligibility-simulations/conversion-funnel`,
      {
        headers: {
          'x-api-key': API_KEY,
        },
      },
    );

    eligibilitySimulationsConversionFunnel = await response.json();

    cache.set(
      namespaces.eligibilitySimulationsConversionFunnel,
      eligibilitySimulationsConversionFunnel,
      TTL_MS,
    );
  }

  return json(eligibilitySimulationsConversionFunnel);
};
