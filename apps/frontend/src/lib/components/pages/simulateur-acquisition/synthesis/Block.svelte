<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    isLast?: boolean;
    children: Snippet;
  };

  const { isLast = false, children }: Props = $props();
</script>

<div
  class="element rounded-tl-lg rounded-tr-lg border-2 border-(--background-contrast-info) p-2 xs:p-4 shadow-md"
  class:fr-mb-4w={!isLast}>
  {@render children()}
</div>
