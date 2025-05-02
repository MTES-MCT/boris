<script lang="ts">
  import type { Snippet } from 'svelte';
  type Props = {
    children: Snippet;
  };

  const { children }: Props = $props();
</script>

<section class="fr-container">
  {@render children()}
</section>

<style lang="postcss">
  section {
    display: flex;
    flex-direction: column;
    gap: var(--8w);
    margin-block-start: var(--8w);
    @media (--md-viewport) {
      gap: 0;
      margin-block-start: var(--15w);
      margin-block-end: var(--10w);
    }
  }
</style>
