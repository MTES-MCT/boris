<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    title: string;
    mascotte: Snippet;
    reversed?: boolean;
  };

  const { title, mascotte, reversed = false }: Props = $props();
</script>

<div
  class="flex items-center justify-center gap-4 mb-8"
  class:flex-row-reverse={reversed}>
  <div class="hidden xs:block">
    {@html mascotte}
  </div>
  <h2 class="fr-mb-0 text-center bg-red-primary inline-block py-1 px-3">
    {title}
  </h2>
</div>
