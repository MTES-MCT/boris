<script lang="ts">
  import type { Snippet } from 'svelte';
  type Props = {
    title: string;
    children: Snippet;
  };
  const { title, children }: Props = $props();
</script>

<div class="fr-container text-center !max-w-[640px] py-16 md:py-32">
  <h1>{title}</h1>
  {@render children()}
</div>
