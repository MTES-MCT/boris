<script lang="ts">
  import type { Snippet } from 'svelte';
  import { default as Star } from '$assets/icons/star.svg?raw';
  type Props = {
    children: Snippet;
  };
  const { children }: Props = $props();
</script>

<div class="fr-col-12 fr-col-lg-4 column">
  <div>
    {@html Star}
  </div>
  <div>
    {@render children()}
  </div>
</div>

<style lang="postcss">
  .column {
    display: flex;
    gap: var(--2w);
    :global(svg) {
      width: var(--4w);
      height: var(--4w);
    }
  }
  @media (--md-viewport) {
    .column {
      gap: var(--2w);
    }
  }
</style>
