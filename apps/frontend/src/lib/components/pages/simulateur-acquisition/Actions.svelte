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
    flex-direction: column-reverse;
    gap: var(--2w);
    border-top: solid 1px var(--border-default-grey);
    padding-top: 1.5rem;

    @media (--xs-viewport) {
      flex-direction: row;
      justify-content: space-between;
      align-items: stretch;
    }

    &.justify-end {
      justify-content: flex-end;
    }
  }
</style>
