import { API_URL } from '$env/static/private';
import { formatOfss } from '$lib/utils/formatters';

import type { OfsView, Pagination } from '$lib/utils/api-types';

export const load = async () => {
  const response = await fetch(`${API_URL}/ofss`);
  const ofss: Pagination<OfsView> = await response.json();

  return {
    regions: formatOfss(ofss.items),
  };
};

export const prerender = false;
