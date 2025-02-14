import type { PageServerLoad } from './$types';
import type { Data } from './definitions';

export const load: PageServerLoad = async ({ fetch }): Promise<Data> => {
  const response = await fetch('/api/blog/articles');
  const articles = await response.json();

  return {
    articles,
  };
};

export const prerender = false;
