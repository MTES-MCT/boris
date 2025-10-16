<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    title: string;
    mascotte: Snippet;
    reversed?: boolean;
  };

  const { title, mascotte, reversed = false }: Props = $props();
</script>

<div
  class="title-container"
  class:title-container--reversed={reversed}>
  <div class="mascotte">
    {@html mascotte}
  </div>
  <h2 class="fr-mb-0">{title}</h2>
</div>

<style lang="postcss">
  .title-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .title-container--reversed {
    flex-direction: row-reverse;
  }

  h2 {
    text-align: center;
    margin-bottom: 3rem;
    background-color: var(--color-red-primary);
    display: inline-block;
    padding: 0.25rem 0.75rem;
  }

  .mascotte {
    display: none;

    @media (--xxs-viewport) {
      display: block;
    }
  }
</style>
