import type { PageLoad } from './$types';
import { PUBLIC_BORIS_CMS_URL } from '$env/static/public';
import type { Article, WagtailApiItemsResponse } from '$lib/utils/definitions';
import type { Data } from './definitions';

export const load: PageLoad = async ({ fetch }): Promise<Data> => {
  const response = await fetch(
    `${PUBLIC_BORIS_CMS_URL}/api/v2/pages?type=blog.BlogEntryPage&fields=*,-body&order=-first_published_at`,
  );
  const data: WagtailApiItemsResponse = await response.json();

  const articles: Article[] = data.items.map((item) => ({
    title: item.title,
    description: item.meta.search_description,
    firstPublishedAt: item.meta.first_published_at,
    slug: item.meta.slug,
  }));

  return {
    articles,
  };
};
