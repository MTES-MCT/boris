import { API_URL } from '$env/static/private';
import { formatOfss } from '$lib/utils/formatters';
import type { OfsView, Pagination } from '$lib/utils/api-types';
import cache, { namespaces } from '$lib/server/cache';

export const load = async () => {
  let ofss = (await cache.get(namespaces.ofss)) as Pagination<OfsView>;

  if (!ofss) {
    const response = await fetch(`${API_URL}/ofss`);
    ofss = await response.json();
    cache.set(namespaces.ofss, ofss);
  }

  return {
    regions: formatOfss(ofss.items),
  };
};

export const prerender = false;
