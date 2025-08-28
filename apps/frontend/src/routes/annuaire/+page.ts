import type { PageLoad } from './$types';
import { getBrsDiffusionWebsites } from '$lib/api/brs-diffusion-websites';
import type { BrsDiffusionWebsiteView, Pagination } from '$lib/utils/api-types';
import { defaultCoords, defaultPagination, defaultRadius } from '$lib/utils/constants';

export type DataType = {
  brsDiffusionWebsites: Pagination<BrsDiffusionWebsiteView>;
};

export const load: PageLoad = async ({ url }): Promise<DataType> => {
  const { searchParams } = url;

  const query = {
    page: Number(searchParams.get('page')) || defaultPagination.page,
    pageSize:
      Number(searchParams.get('pageSize')) || defaultPagination.pageSize,
    latitude: defaultCoords.latitude,
    longitude: defaultCoords.longitude,
    radius: defaultRadius
  };

  const brsDiffusionWebsites = await getBrsDiffusionWebsites(query);

  const data = {
    brsDiffusionWebsites,
  };

  return data;
};

export const csr = true;
export const ssr = false;