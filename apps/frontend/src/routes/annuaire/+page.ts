import type { PageLoad } from './$types';
import { getAllBrsDiffusionWebsites } from '$lib/api/brs-diffusion-websites';
import type { BrsDiffusionWebsiteView, Pagination } from '$lib/utils/api-types';

export type DataType = {
  mapBrsDiffusionWebsites: Pagination<BrsDiffusionWebsiteView>;
};

export const load: PageLoad = async (): Promise<DataType> => {
  const mapBrsDiffusionWebsites = await getAllBrsDiffusionWebsites();

  return {
    mapBrsDiffusionWebsites,
  };
};

export const csr = true;
export const ssr = false;
