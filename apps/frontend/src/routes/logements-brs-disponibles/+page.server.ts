import { API_URL } from '$env/static/private';
import { formatOfss } from '$lib/utils/formatters';
import type { OfsView, Pagination } from '$lib/utils/api-types';
import Keyv from 'keyv';

const TTL_MINS = 1;
const TTL_MS = TTL_MINS * 60 * 1000;
const ofssCache = new Keyv({ namespace: 'ofss', ttl: TTL_MS });

export const load = async () => {
  const cache = await ofssCache.get('ofss');

  console.log(cache);

  if (cache) {
    return {
      regions: formatOfss(cache.items),
    };
  } else {
    const response = await fetch(`${API_URL}/ofss`);
    const ofss: Pagination<OfsView> = await response.json();

    ofssCache.set('ofss', ofss);

    return {
      regions: formatOfss(ofss.items),
    };
  }
};

export const prerender = false;
