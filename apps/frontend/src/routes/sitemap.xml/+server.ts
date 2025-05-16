import * as sitemap from 'super-sitemap';
import type { RequestHandler } from './$types';
import { steps } from '$routes/tout-savoir-sur-le-bail-reel-solidaire-brs/[slug]/content';

export const GET: RequestHandler = async ({ url }) => {
  const stepSlugs = steps.map((step) => step.slug);

  return await sitemap.response({
    origin: url.origin,
    paramValues: {
      '/tout-savoir-sur-le-bail-reel-solidaire-brs/[slug]': stepSlugs,
    },
  });
};
