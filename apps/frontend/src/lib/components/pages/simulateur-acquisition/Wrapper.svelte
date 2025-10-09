<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    children: Snippet;
  };

  const { children }: Props = $props();
</script>

<div
  id="simulateur-acquisition"
  class="wrapper">
  {@render children()}
</div>

<style lang="postcss">
  @media (--md-viewport) {
    .wrapper {
      display: flex;
      justify-content: center;
      align-items: stretch;
    }
  }
</style>
