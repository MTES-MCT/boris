import { API_URL, API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import cache, { namespaces, TTL_MS } from '$lib/server/cache';

export const GET = async () => {
  let data = await cache.get(
    namespaces.eligibilitySimulationsRealEstateSituation,
  );

  if (!data) {
    const response = await fetch(
      `${API_URL}/eligibility-simulations/real-estate-situation`,
      {
        headers: {
          'x-api-key': API_KEY,
        },
      },
    );

    data = await response.json();

    cache.set(
      namespaces.eligibilitySimulationsRealEstateSituation,
      data,
      TTL_MS,
    );
  }

  return json(data);
};
