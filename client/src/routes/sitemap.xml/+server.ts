import * as sitemap from 'super-sitemap';
import type { RequestHandler } from './$types';
import type { Article } from '$lib/utils/definitions';

export const GET: RequestHandler = async ({ url, fetch }) => {
  const response = await fetch('/api/blog/articles');
  const articles: Article[] = await response.json();
  const articleSlugs = articles.map(({ slug }) => slug);

  return await sitemap.response({
    origin: url.origin,
    paramValues: {
      '/blog/[slug]': articleSlugs,
    },
  });
};
