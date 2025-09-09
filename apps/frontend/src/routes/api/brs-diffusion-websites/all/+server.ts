import { json } from '@sveltejs/kit';
import { API_URL } from '$env/static/private';
import type { BrsDiffusionWebsiteView, Pagination } from '$lib/utils/api-types';

export const GET = async () => {
  const url = new URL(`${API_URL}/brs-diffusion-websites`);

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

  return json({
    ...data,
    page: 1,
    pagesCount: 1,
    hasNextPage: false,
    hasPreviousPage: false,
    pageSize: data.totalCount,
  });
};
