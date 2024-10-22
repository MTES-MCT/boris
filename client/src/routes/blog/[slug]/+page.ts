import type { PageLoad } from './$types';
import type { Data } from './definitions';

export const load: PageLoad = ({ params }) => {
  const data: Data = {
    slug: params.slug,
  };

  return data;
};
