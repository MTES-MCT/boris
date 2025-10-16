import type { PageServerLoad } from './$types';
import type { OfsView, Pagination } from '$lib/utils/api-types';

export type DataType = {
  ofss: Pagination<OfsView>;
};

export const load: PageServerLoad = async ({ fetch }): Promise<DataType> => {
  const response = await fetch('api/ofss');
  const ofss = await response.json();

  return {
    ofss,
  };
};
