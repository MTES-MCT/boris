<script lang="ts">
  import type { Snippet } from 'svelte';
  import { default as Star } from '$assets/icons/star.svg?raw';

  type Props = {
    children: Snippet;
  };

  const { children }: Props = $props();
</script>

<div class="fr-col-12 fr-col-lg-4 flex gap-2w">
  <div class="svg-container">
    {@html Star}
  </div>
  <div>
    {@render children()}
  </div>
</div>

<style lang="postcss">
  .svg-container {
    :global(svg) {
      width: 2rem;
      height: 2rem;
    }
  }
</style>
