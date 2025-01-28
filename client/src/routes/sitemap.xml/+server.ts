import * as sitemap from 'super-sitemap';
import type { RequestHandler } from './$types';
import type { Article } from '$lib/utils/definitions';
import { steps } from '$routes/tout-savoir-sur-le-bail-reel-solidaire-brs/[slug]/content';

export const GET: RequestHandler = async ({ url, fetch }) => {
  const response = await fetch('/api/blog/articles');
  const articles: Article[] = await response.json();
  const articleSlugs = articles.map(({ slug }) => slug);

  const stepSlugs = steps.map((step) => step.slug);

  return await sitemap.response({
    origin: url.origin,
    paramValues: {
      '/blog/[slug]': articleSlugs,
      '/tout-savoir-sur-le-bail-reel-solidaire-brs/[slug]': stepSlugs,
    },
  });
};
