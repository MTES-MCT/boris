import type { Snippet } from 'svelte';
import type { BackgroundClasss, Heading } from '$lib/utils/types';

export type Props = {
  title: string;
  children: Snippet;
  titleElement?: Heading;
  backgroundClass?: BackgroundClasss;
};
