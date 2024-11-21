<script lang="ts">
  import type { Props } from './definitions';

  const {
    title,
    children,
    titleElement = 'h2',
    backgroundClass = '',
  }: Props = $props();
</script>

<section class={`fr-col-12 ${backgroundClass}`}>
  <svelte:element this={titleElement}>{title}</svelte:element>

  {@render children()}
</section>
