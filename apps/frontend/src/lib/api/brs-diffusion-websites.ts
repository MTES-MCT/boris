import { API_URL } from '$env/static/private';
import type { Pagination, BrsDiffusionWebsiteView } from '$lib/utils/api-types';
import type { operations } from '$lib/utils/generated-api-types';

export const getBrsDiffusionWebsites = async (
  query?: operations['GetBrsDiffusionWebsitesApiController_index']['parameters']['query'],
): Promise<Pagination<BrsDiffusionWebsiteView>> => {
  const url = new URL(`${API_URL}/brs-diffusion-websites`);

  if (query?.page) {
    url.searchParams.set('page', query.page.toString());
  }

  if (query?.pageSize) {
    url.searchParams.set('pageSize', query.pageSize.toString());
  }

  const response = await fetch(url);
  const data: Pagination<BrsDiffusionWebsiteView> = await response.json();

  return data;
};
