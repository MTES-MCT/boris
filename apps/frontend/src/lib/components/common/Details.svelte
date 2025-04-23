<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    summary: string;
    children: Snippet;
  };

  const { summary, children }: Props = $props();
</script>

<details>
  <summary>{summary}</summary>
  {@render children()}
</details>

<style lang="postcss">
  details {
    margin-block-end: var(--3w);
  }

  summary {
    margin-block-end: var(--2w);
    font-weight: bold;
  }
</style>
