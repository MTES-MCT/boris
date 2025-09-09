import { json } from '@sveltejs/kit';
import { API_URL } from '$env/static/private';
import cache, { namespaces } from '$lib/server/cache';

export const GET = async () => {
  let brsDiffusionWebsites = await cache.get(namespaces.brsDiffusionWebsites);

  if (!brsDiffusionWebsites) {
    const url = new URL(`${API_URL}/brs-diffusion-websites`);

    url.searchParams.set('page', '1');
    url.searchParams.set('pageSize', '150');

    const response = await fetch(url);

    brsDiffusionWebsites = await response.json();

    let currentPage = brsDiffusionWebsites.page;

    if (brsDiffusionWebsites.hasNextPage) {
      for (const _ of new Array(brsDiffusionWebsites.pagesCount - 1)) {
        currentPage = currentPage + 1;

        url.searchParams.set('page', currentPage.toString());

        const pageResponse = await fetch(url);
        const pageData = await pageResponse.json();

        brsDiffusionWebsites.items = [
          ...brsDiffusionWebsites.items,
          ...pageData.items,
        ];
      }
    }

    cache.set(namespaces.brsDiffusionWebsites, brsDiffusionWebsites);
  }

  return json({
    ...brsDiffusionWebsites,
    page: 1,
    pagesCount: 1,
    hasNextPage: false,
    hasPreviousPage: false,
    pageSize: brsDiffusionWebsites.totalCount,
  });
};
