import { API_URL } from '$env/static/private';
import { formatOfss } from '$lib/utils/formatters';
import type { OfsView, Pagination } from '$lib/utils/api-types';
import Keyv from 'keyv';

const namespace = 'ofss';
const TTL_HOURS = 24;
const TTL_MINS = 60;
const TTL_MS = TTL_HOURS * TTL_MINS * 60 * 1000;
const cache = new Keyv({ namespace, ttl: TTL_MS });

export const load = async () => {
  let ofss = (await cache.get(namespace)) as Pagination<OfsView>;

  if (!ofss) {
    const response = await fetch(`${API_URL}/ofss`);
    ofss = await response.json();
    cache.set(namespace, ofss);
  }

  return {
    regions: formatOfss(ofss.items),
  };
};

export const prerender = false;
