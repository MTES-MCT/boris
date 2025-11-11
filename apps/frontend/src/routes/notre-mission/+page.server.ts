import type { PageServerLoad } from './$types';
import { statistics } from '$lib/utils/constants';

type PageData = {
  statistics: {
    amount: string;
    subtitle: string;
    content: string;
  }[];
};

export const load: PageServerLoad = async ({ fetch }): Promise<PageData> => {
  const response = await fetch('api/ofss');
  const ofss = await response.json();

  return {
    statistics: [
      ...statistics,
      {
        amount: ofss.totalCount.toString(),
        subtitle: 'Organismes de foncier solidaire (OFS) partenaires',
        content: '',
      },
    ],
  };
};
