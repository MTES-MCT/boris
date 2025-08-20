import type { Page } from '@sveltejs/kit';
import { PUBLIC_NODE_ENV } from '$env/static/public';
export const blockSearchEngineIndexing = (page: Page): boolean => {
  const hiddenPaths = ['/questionnaire', '/simulateur-acquisition'];

  console.log('PUBLIC_NODE_ENV', PUBLIC_NODE_ENV);

  return (
    (PUBLIC_NODE_ENV !== 'production' && PUBLIC_NODE_ENV !== 'ci') ||
    hiddenPaths.includes(page.route.id as string)
  );
};
