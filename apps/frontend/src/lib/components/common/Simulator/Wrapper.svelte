<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    children: Snippet;
  };

  const { children }: Props = $props();
</script>

<div
  id="simulateur-acquisition"
  class="lg:flex lg:justify-center lg:items-stretch">
  {@render children()}
</div>
