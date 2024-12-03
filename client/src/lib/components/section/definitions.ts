import type { Snippet } from 'svelte';
import type { BackgroundClasss, Heading } from '$lib/utils/definitions';

export type Props = {
  children: Snippet;
  titleElement?: Heading;
  backgroundClass?: BackgroundClasss;
  title?: string;
  id?: string;
};
