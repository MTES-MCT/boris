import type { PageServerLoad } from './$types';
import { statistics } from '$lib/utils/constants';
import type { Statistic } from '$lib/utils/definitions';

export const load: PageServerLoad = async ({
  fetch,
}): Promise<{ statistics: Statistic[] }> => {
  const response = await fetch('api/ofss');
  const ofss = await response.json();

  return {
    statistics: [
      ...statistics.slice(0, statistics.length - 1),
      {
        amount: ofss.totalCount.toString(),
        subtitle: 'Organismes de foncier solidaire (OFS) partenaires',
        content: '',
        pictogram: 'humanCooperation',
      },
      statistics[statistics.length - 1],
    ],
  };
};
