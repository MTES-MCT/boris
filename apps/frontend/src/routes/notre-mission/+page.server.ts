import type { PageServerLoad } from './$types';
import { statistics } from '$lib/utils/constants';

export const load: PageServerLoad = async ({ fetch }) => {
  const response = await fetch('api/ofss');
  const ofss = await response.json();

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
