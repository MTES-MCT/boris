import type { PageLoad } from './$types';
import type { BrsDiffusionWebsiteView, Pagination } from '$lib/utils/api-types';

type PageData = {
  mapBrsDiffusionWebsites: Pagination<BrsDiffusionWebsiteView>;
};

export const load: PageLoad = async ({ fetch }): Promise<PageData> => {
  const response = await fetch('api/brs-diffusion-websites/all');
  const mapBrsDiffusionWebsites = await response.json();

  return {
    mapBrsDiffusionWebsites,
  };
};

export const csr = true;
export const ssr = false;
