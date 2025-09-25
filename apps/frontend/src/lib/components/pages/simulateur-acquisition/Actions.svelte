<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    justifyEnd?: boolean;
    children: Snippet;
  };

  const { justifyEnd, children }: Props = $props();
</script>

<nav
  class:justify-end={justifyEnd}
  aria-label="Liens vers les autres étapes du simulateur d'acquisition">
  {@render children()}
</nav>

<style lang="postcss">
  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &.justify-end {
      justify-content: flex-end;
    }
  }
</style>
