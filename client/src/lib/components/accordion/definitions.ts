import type { Snippet } from 'svelte';
import type { Heading } from '$lib/utils/types';

export type Props = {
  label: string;
  labelElement?: Heading;
  children: Snippet;
};
