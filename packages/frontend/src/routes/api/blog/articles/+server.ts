import { PUBLIC_BORIS_CMS_URL } from '$env/static/public';
import type { Article, WagtailApiItemsResponse } from '$lib/utils/definitions';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ fetch }) => {
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

  return json(articles);
};
