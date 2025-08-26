import { getOfss } from '$lib/api/ofss';
import { statistics } from '$lib/utils/constants';

export const load = async () => {
  const ofss = await getOfss();

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
