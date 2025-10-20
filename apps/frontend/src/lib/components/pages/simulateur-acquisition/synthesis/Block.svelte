<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    isLast?: boolean;
    children: Snippet;
  };

  const { isLast = false, children }: Props = $props();
</script>

<div
  class="element"
  class:fr-mb-4w={!isLast}>
  {@render children()}
</div>

<style lang="postcss">
  .element {
    border-top-left-radius: var(--border-radius-sm);
    border-top-right-radius: var(--border-radius-sm);
    border: solid 2px var(--background-contrast-info);
    padding: 0.5rem;
    box-shadow: 0 3px 6px rgba(134, 144, 162, 0.2);

    @media (--xxs-viewport) {
      padding: 1rem;
    }

    @media (--md-viewport) {
      padding-inline: 1.5rem;
      padding-block: 1rem;
    }
  }
</style>
