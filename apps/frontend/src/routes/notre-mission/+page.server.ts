import { API_URL } from '$env/static/private';
import type { OfsView, Pagination } from '$lib/utils/api-types';
import { statistics } from '$lib/utils/constants';

export const load = async () => {
  const response = await fetch(`${API_URL}/ofss`);
  const ofss: Pagination<OfsView> = await response.json();

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
