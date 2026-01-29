<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    children: Snippet;
  };

  const { children }: Props = $props();
</script>

<div
  data-testid="simulator-wrapper"
  class="lg:flex lg:justify-center lg:items-stretch">
  {@render children()}
</div>
