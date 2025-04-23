<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    title: string;
    children: Snippet;
  };

  const { title, children }: Props = $props();
</script>

<section class="fr-container">
  <h3>{title}</h3>
  {@render children()}
</section>

<style lang="postcss">
  section {
    max-width: calc(100% - var(--8w));
    margin-block-start: var(--4w);
    margin-inline: auto;
    padding: var(--3w);
    border: solid var(--path-thickness) var(--color-red-primary);
    border-radius: var(--border-radius-lg);
  }

  @media (--md-viewport) {
    section {
      max-width: 700px;
      padding: var(--6w);
      margin-block-start: var(--13w);
    }
  }
</style>
