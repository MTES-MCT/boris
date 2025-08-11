import type { PageServerLoad } from './$types';
import { getBrsDiffusionWebsites } from '$lib/api/brs-diffusion-websites';
import type { BrsDiffusionWebsiteView, Pagination } from '$lib/utils/api-types';
import { defaultPagination } from '$lib/utils/constants';

export type DataType = {
  brsDiffusionWebsites: Pagination<BrsDiffusionWebsiteView>;
};

export const load: PageServerLoad = async ({ url }): Promise<DataType> => {
  const { searchParams } = url;

  const query = {
    page: Number(searchParams.get('page')) || defaultPagination.page,
    pageSize:
      Number(searchParams.get('pageSize')) || defaultPagination.pageSize,
  };

  const brsDiffusionWebsites = await getBrsDiffusionWebsites(query);

  const data = {
    brsDiffusionWebsites,
  };

  return data;
};

export const prerender = false;
