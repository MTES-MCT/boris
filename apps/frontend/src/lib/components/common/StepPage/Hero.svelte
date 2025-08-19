<script lang="ts">
  import type { Snippet } from 'svelte';
  type Props = {
    title: string;
    children: Snippet;
  };
  const { title, children }: Props = $props();
</script>

<div class="fr-container hero">
  <h1>{title}</h1>
  {@render children()}
</div>

<style lang="postcss">
  .hero {
    text-align: center;
    max-width: 640px;
    padding-block: var(--8w);

    @media (--sm-viewport) {
      padding-block: var(--15w);
      h1 {
        max-width: 580px;
        margin: 0 auto;
        margin-bottom: var(--5w);
      }
    }
  }
</style>
