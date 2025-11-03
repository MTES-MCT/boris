<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    justifyEnd?: boolean;
    children: Snippet;
  };

  const { justifyEnd, children }: Props = $props();
</script>

<nav
  class="flex flex-column-reverse sm_flex-row sm_align-stretch gap-2w fr-pt-3w border-top-light"
  class:justify-end={justifyEnd}
  class:sm_justify-between={!justifyEnd}
  aria-label="Liens vers les autres étapes du simulateur d'acquisition">
  {@render children()}
</nav>
