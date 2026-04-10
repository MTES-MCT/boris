import { API_KEY, API_URL } from '$env/static/private';
import cache, { namespaces, TTL_MS } from '$lib/server/cache';
import { json } from '@sveltejs/kit';

export const GET = async () => {
  let data = await cache.get(namespaces.eligibilitySimulationsEligibility);

  if (!data) {
    const response = await fetch(
      `${API_URL}/eligibility-simulations/eligibility`,
      {
        headers: {
          'x-api-key': API_KEY,
        },
      },
    );

    data = await response.json();

    cache.set(namespaces.eligibilitySimulationsEligibility, data, TTL_MS);
  }

  return json(data);
};
