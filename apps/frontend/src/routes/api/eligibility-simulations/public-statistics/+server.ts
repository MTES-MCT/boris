import { API_KEY, API_URL } from '$env/static/private';
import cache, { namespaces, TTL_MS } from '$lib/server/cache';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
  const query = new URLSearchParams();
  const departementCode = url.searchParams.get('departementCode');
  const postalCode = url.searchParams.get('postalCode');

  if (departementCode) query.set('departementCode', departementCode);
  if (postalCode) query.set('postalCode', postalCode);

  const cacheKey = `${namespaces.eligibilitySimulationsPublicStatistics}:${query.toString()}`;
  let data = await cache.get(cacheKey);

  if (!data) {
    const response = await fetch(
      `${API_URL}/eligibility-simulations/public-statistics?${query.toString()}`,
      { headers: { 'x-api-key': API_KEY } },
    );

    if (!response.ok) {
      throw error(response.status, 'Impossible de charger les statistiques');
    }

    data = await response.json();
    await cache.set(cacheKey, data, TTL_MS);
  }

  return json(data);
};
