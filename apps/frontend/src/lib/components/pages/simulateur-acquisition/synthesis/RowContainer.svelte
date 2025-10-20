<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    children: Snippet;
  };

  const { children }: Props = $props();
</script>

<div class="row-container">
  {@render children()}
</div>

<style lang="postcss">
  .row-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
</style>
