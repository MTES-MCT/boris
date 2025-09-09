import { PUBLIC_API_URL } from '$env/static/public';
import type { Pagination, BrsDiffusionWebsiteView } from '$lib/utils/api-types';
import type { operations } from '$lib/utils/generated-api-types';

export const getBrsDiffusionWebsites = async (
  query?: operations['GetBrsDiffusionWebsitesApiController_index']['parameters']['query'],
): Promise<Pagination<BrsDiffusionWebsiteView>> => {
  const url = new URL(`${PUBLIC_API_URL}/brs-diffusion-websites`);

  if (query?.page) {
    url.searchParams.set('page', query.page.toString());
  }

  if (query?.pageSize) {
    url.searchParams.set('pageSize', query.pageSize.toString());
  }

  if (query?.latitude && query?.longitude) {
    url.searchParams.set('latitude', query.latitude.toString());
    url.searchParams.set('longitude', query.longitude.toString());
  }

  if (query?.radius) {
    url.searchParams.set('radius', query.radius.toString());
  }

  const response = await fetch(url);
  const data: Pagination<BrsDiffusionWebsiteView> = await response.json();

  return data;
};

export const getAllBrsDiffusionWebsites = async (): Promise<
  Pagination<BrsDiffusionWebsiteView>
> => {
  const url = new URL(`${PUBLIC_API_URL}/brs-diffusion-websites`);

  url.searchParams.set('page', '1');
  url.searchParams.set('pageSize', '150');

  const response = await fetch(url);

  const data: Pagination<BrsDiffusionWebsiteView> = await response.json();

  let currentPage = data.page;

  if (data.hasNextPage) {
    for (const _ of new Array(data.pagesCount - 1)) {
      currentPage = currentPage + 1;

      url.searchParams.set('page', currentPage.toString());

      const pageResponse = await fetch(url);
      const pageData = await pageResponse.json();

      data.items = [...data.items, ...pageData.items];
    }
  }

  return {
    ...data,
    page: 1,
    pagesCount: 1,
    hasNextPage: false,
    hasPreviousPage: false,
    pageSize: data.totalCount,
  };
};
