import type { PageServerLoad } from './$types';
import type { OfsView, Pagination } from '$lib/utils/api-types';

type PageData = {
  ofss: Pagination<OfsView>;
};

export const load: PageServerLoad = async ({ fetch }): Promise<PageData> => {
  const response = await fetch('api/ofss', { cache: 'no-store' });
  const ofss = response.ok
    ? await response.json()
    : { items: [], totalCount: 0 };

  return {
    ofss,
  };
};
