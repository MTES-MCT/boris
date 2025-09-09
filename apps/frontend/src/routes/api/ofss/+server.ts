import { API_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';
import cache, { namespaces } from '$lib/server/cache';

export const GET = async () => {
  let ofss = await cache.get(namespaces.ofss);

  if (!ofss) {
    const response = await fetch(`${API_URL}/ofss`);
    ofss = await response.json();
    cache.set(namespaces.ofss, ofss);
  }

  return json(ofss);
};
