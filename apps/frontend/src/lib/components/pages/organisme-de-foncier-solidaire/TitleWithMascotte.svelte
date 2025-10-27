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
  class="flex align-center justify-center gap-2w fr-mb-6w title-container"
  class:flex-row-reverse={reversed}>
  <div class="mascotte none xxs_block">
    {@html mascotte}
  </div>
  <h2
    class="background-color-red-primary text-center fr-mb-0 fr-px-1w fr-py-1v">
    {title}
  </h2>
</div>
