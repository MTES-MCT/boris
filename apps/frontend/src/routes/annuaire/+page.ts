import type { PageLoad } from './$types';
import {
  getBrsDiffusionWebsites,
  getAllBrsDiffusionWebsites,
} from '$lib/api/brs-diffusion-websites';
import type { BrsDiffusionWebsiteView, Pagination } from '$lib/utils/api-types';
import {
  defaultPagination,
  defaultRadius,
  parisCoords,
} from '$lib/utils/constants';

export type DataType = {
  mapBrsDiffusionWebsites: Pagination<BrsDiffusionWebsiteView>;
  listBrsDiffusionWebsites: Pagination<BrsDiffusionWebsiteView>;
};

export const load: PageLoad = async (): Promise<DataType> => {
  const listQuery = {
    page: defaultPagination.page,
    pageSize: defaultPagination.pageSize,
    latitude: parisCoords.latitude,
    longitude: parisCoords.longitude,
    radius: defaultRadius,
  };

  const mapBrsDiffusionWebsites = await getAllBrsDiffusionWebsites();
  const listBrsDiffusionWebsites = await getBrsDiffusionWebsites(listQuery);

  return {
    mapBrsDiffusionWebsites,
    listBrsDiffusionWebsites,
  };
};

export const csr = true;
export const ssr = false;
