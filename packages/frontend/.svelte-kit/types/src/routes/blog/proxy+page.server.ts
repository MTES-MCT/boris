// @ts-nocheck
import type { PageServerLoad } from './$types';
import type { Data } from './definitions';

export const load = async ({ fetch }: Parameters<PageServerLoad>[0]): Promise<Data> => {
  const response = await fetch('/api/blog/articles');
  const articles = await response.json();

  return {
    articles,
  };
};

export const prerender = false;
