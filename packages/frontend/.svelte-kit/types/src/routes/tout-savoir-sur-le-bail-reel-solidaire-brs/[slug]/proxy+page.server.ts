// @ts-nocheck
import type { Step } from '$lib/utils/definitions';
import type { EntryGenerator, PageServerLoad } from './$types';

import { redirect } from '@sveltejs/kit';
import { steps } from './content';

export const load = async ({ params }: Parameters<PageServerLoad>[0]): Promise<Step> => {
  const { slug } = params;

  const step = steps.find((step) => step.slug === slug);

  if (!step) {
    redirect(301, '/not-found');
  } else {
    return step;
  }
};

export const entries: EntryGenerator = () => {
  return steps.map((step) => ({ slug: step.slug }));
};
