import type { PageServerLoad } from './$types';
import { formatOfss } from '$lib/utils/formatters';

export const load: PageServerLoad = async ({ fetch }) => {
  const response = await fetch('api/ofss');
  const ofss = await response.json();

  return {
    regions: formatOfss(ofss.items),
  };
};
