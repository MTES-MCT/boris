<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    children: Snippet;
  };

  const { children }: Props = $props();
</script>

<div class="fr-container--fluid">
  <div class="fr-grid-row">
    {@render children()}
  </div>
</div>

<style lang="postcss">
  .fr-container--fluid {
    margin-top: 4rem;
    overflow: visible;
  }
</style>
