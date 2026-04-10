import { API_URL, API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import cache, { namespaces, TTL_MS } from '$lib/server/cache';

export const GET = async () => {
  let data = await cache.get(namespaces.eligibilitySimulationsBrsKnowledge);

  if (!data) {
    const response = await fetch(
      `${API_URL}/eligibility-simulations/brs-knowledge`,
      {
        headers: {
          'x-api-key': API_KEY,
        },
      },
    );

    data = await response.json();

    cache.set(namespaces.eligibilitySimulationsBrsKnowledge, data, TTL_MS);
  }

  return json(data);
};
