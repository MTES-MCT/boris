<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    children: Snippet;
  };

  const { children }: Props = $props();
</script>

<div>
  <span
    class={`fr-icon-lightbulb-line inline-block fr-p-2w rounded-full bg-blue-light text-blue-primary`}
    aria-hidden="true">
  </span>
</div>
<div>
  {@render children()}
</div>
