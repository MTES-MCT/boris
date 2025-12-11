import { API_URL, API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import cache, { namespaces, TTL_MS } from '$lib/server/cache';

export const GET = async () => {
  let partnerOfss = await cache.get(namespaces.partnerOfss);

  if (!partnerOfss) {
    const response = await fetch(`${API_URL}/ofss?isPartner=true`, {
      headers: {
        'x-api-key': API_KEY,
      },
    });

    partnerOfss = await response.json();

    cache.set(namespaces.partnerOfss, partnerOfss, TTL_MS);
  }

  return json(partnerOfss);
};
