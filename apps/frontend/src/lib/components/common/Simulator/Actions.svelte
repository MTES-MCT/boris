<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    justifyEnd?: boolean;
    children: Snippet;
  };

  const { justifyEnd, children }: Props = $props();
</script>

<nav
  class="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-stretch gap-4 border-t-1 border-t-(--border-default-grey) pt-6"
  class:!justify-end={justifyEnd}
  aria-label="Liens vers les autres étapes du simulateur d'acquisition">
  {@render children()}
</nav>
