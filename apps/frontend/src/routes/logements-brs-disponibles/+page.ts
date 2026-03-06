import type { PageLoad } from './$types';
import type { BrsDiffusionWebsiteView, Pagination } from '$lib/utils/api-types';

type PageData = {
  mapBrsDiffusionWebsites: Pagination<BrsDiffusionWebsiteView>;
  loadError?: boolean;
};

const emptyBrsDiffusionWebsites: Pagination<BrsDiffusionWebsiteView> = {
  items: [],
  totalCount: 0,
  page: 1,
  pageSize: 0,
  pagesCount: 1,
  hasPreviousPage: false,
  hasNextPage: false,
};

export const load: PageLoad = async ({ fetch }): Promise<PageData> => {
  const response = await fetch('api/brs-diffusion-websites/all', {
    cache: 'no-store',
  });

  if (!response.ok) {
    return {
      mapBrsDiffusionWebsites: emptyBrsDiffusionWebsites,
      loadError: true,
    };
  }

  const mapBrsDiffusionWebsites = await response.json();

  return {
    mapBrsDiffusionWebsites,
  };
};

export const csr = true;
export const ssr = false;
