import type { Page } from '@sveltejs/kit';
import { PUBLIC_NODE_ENV } from '$env/static/public';

export const blockSearchEngineIndexing = (page: Page): boolean => {
  const hiddenPaths = ['/questionnaire', '/simulateur-acquisition'];

  return (
    (PUBLIC_NODE_ENV !== 'production' && PUBLIC_NODE_ENV !== 'ci') ||
    hiddenPaths.includes(page.route.id as string)
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = (callback: (...args: any[]) => void, wait = 300) => {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: unknown[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => callback(...args), wait);
  };
};

export const clickOutside = (node: Element) => {
  const handleClick = (event: Event) => {
    if (!node.contains(<Node>event.target)) {
      node.dispatchEvent(new CustomEvent('clickoutside'));
    }
  };

  document.addEventListener('click', handleClick, true);

  return {
    destroy() {
      document.removeEventListener('click', handleClick, true);
    },
  };
};
