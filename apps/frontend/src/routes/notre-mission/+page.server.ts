import { API_URL } from '$env/static/private';
import type { OfsView, Pagination } from '$lib/utils/api-types';
import { statistics } from '$lib/utils/constants';
import cache, { namespaces } from '$lib/server/cache';

export const load = async () => {
  let ofss = (await cache.get(namespaces.ofss)) as Pagination<OfsView>;

  if (!ofss) {
    const response = await fetch(`${API_URL}/ofss`);
    ofss = await response.json();
    cache.set(namespaces.ofss, ofss);
  }

  return {
    statistics: [
      ...statistics,
      {
        amount: ofss.totalCount.toString(),
        subtitle: 'Organismes de Foncier Solidaire partenaires',
        content: '',
      },
    ],
  };
};

export const prerender = false;
