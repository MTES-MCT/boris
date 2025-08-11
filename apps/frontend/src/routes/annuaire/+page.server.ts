import type { PageServerLoad } from './$types';
import { getBrsDiffusionWebsites } from '$lib/api/brs-diffusion-websites';
import type { BrsDiffusionWebsiteView, Pagination } from '$lib/utils/api-types';

export type DataType = {
  brsDiffusionWebsites: Pagination<BrsDiffusionWebsiteView>;
};

export const load: PageServerLoad = async (): Promise<DataType> => {
  const brsDiffusionWebsites = await getBrsDiffusionWebsites();

  const data = {
    brsDiffusionWebsites,
  };

  return data;
};

export const prerender = false;
