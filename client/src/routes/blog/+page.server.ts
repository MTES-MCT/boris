import type { PageServerLoad } from './$types';
import { BORIS_CMS_URL } from '$env/static/private';
import type { BlogPost, WagtailApiItemsResponse } from '$lib/utils/definitions';
import type { Data } from './definitions';

export const load: PageServerLoad = async ({ fetch }): Promise<Data> => {
  const response = await fetch(
    `${BORIS_CMS_URL}/api/v2/pages?type=blog.BlogEntryPage&fields=*,-body&order=-first_published_at`,
  );
  const data: WagtailApiItemsResponse = await response.json();

  const blogPosts: BlogPost[] = data.items.map((item) => ({
    title: item.title,
    description: item.meta.search_description,
    firstPublishedAt: item.meta.first_published_at,
    slug: item.meta.slug,
  }));

  return {
    blogPosts,
  };
};
