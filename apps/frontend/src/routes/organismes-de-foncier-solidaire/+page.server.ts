import type { PageServerLoad } from './$types';
import type { OfsView, Pagination } from '$lib/utils/api-types';

type PageData = {
  ofss: Pagination<OfsView>;
};

export const load: PageServerLoad = async ({ fetch }): Promise<PageData> => {
  const response = await fetch('api/ofss');
  const ofss = await response.json();

  return {
    ofss,
  };
};
