import { error, json } from '@sveltejs/kit';
import { API_KEY, API_URL } from '$env/static/private';
import cache, { namespaces, PROGRAM_MAP_TTL_MS } from '$lib/server/cache';

export const GET = async () => {
  let brsDiffusionWebsites = await cache.get(namespaces.brsDiffusionWebsites);

  if (!brsDiffusionWebsites) {
    const url = new URL(`${API_URL}/brs-diffusion-websites`);

    url.searchParams.set('page', '1');
    url.searchParams.set('pageSize', '150');

    const response = await fetch(url, {
      headers: {
        'x-api-key': API_KEY,
      },
    });

    if (!response.ok) {
      throw error(502, 'Impossible de charger les programmes.');
    }

    brsDiffusionWebsites = await response.json();

    let currentPage = brsDiffusionWebsites.page;

    if (brsDiffusionWebsites.hasNextPage) {
      for (const _ of new Array(brsDiffusionWebsites.pagesCount - 1)) {
        currentPage = currentPage + 1;

        url.searchParams.set('page', currentPage.toString());

        const pageResponse = await fetch(url, {
          headers: {
            'x-api-key': API_KEY,
          },
        });
        if (!pageResponse.ok) {
          throw error(502, 'Impossible de charger les programmes.');
        }
        const pageData = await pageResponse.json();

        brsDiffusionWebsites.items = [
          ...brsDiffusionWebsites.items,
          ...pageData.items,
        ];
      }
    }

    await cache.set(
      namespaces.brsDiffusionWebsites,
      brsDiffusionWebsites,
      PROGRAM_MAP_TTL_MS,
    );
  }

  return json(
    {
      ...brsDiffusionWebsites,
      page: 1,
      pagesCount: 1,
      hasNextPage: false,
      hasPreviousPage: false,
      pageSize: brsDiffusionWebsites.totalCount,
    },
    { headers: { 'cache-control': 'no-store' } },
  );
};

export const prerender = false;
