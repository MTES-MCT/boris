<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    children: Snippet;
  };

  const { children }: Props = $props();
</script>

<div class="border-1 border-gray-light rounded-lg p-4 md:p-8 lg:p-16">
  {@render children()}
</div>
