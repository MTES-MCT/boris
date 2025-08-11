import type { PageServerLoad } from './$types';
import { formatOfss } from '$lib/utils/formatters';

export const load: PageServerLoad = async ({ fetch }) => {
  const response = await fetch('api/ofss');
  const ofss = await response.json();

  const data = {
    regions: formatOfss(ofss.items),
  };

  return data;
};
