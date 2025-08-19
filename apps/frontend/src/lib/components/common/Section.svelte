<script lang="ts">
  import type { Heading } from '$lib/utils/definitions';
  import type { Snippet } from 'svelte';

  type Props = {
    children: Snippet;
    titleElement?: Heading;
    title?: string;
    id?: string;
    narrow?: boolean;
  };

  const {
    title,
    children,
    titleElement = 'h2',
    id,
    narrow = false,
  }: Props = $props();
</script>

<section
  {id}
  class="section"
  class:narrow>
  <div class="fr-container">
    <div class="fr-col-12">
      {#if title}
        <svelte:element this={titleElement}>{title}</svelte:element>
      {/if}

      {@render children()}
    </div>
  </div>
</section>

<style lang="postcss">
  .section {
    padding-block: var(--2w);
  }

  .narrow {
    width: 100%;
    max-width: 636px;
    margin: 0 auto;
    text-align: center;
  }

  .section:nth-last-child(1) {
    padding-block-end: var(--4w);
  }

  .section:nth-child(1) {
    padding-block-start: var(--4w);
  }

  @media (--sm-viewport) {
    .section {
      padding-block: var(--4w);
    }

    .section:nth-child(1) {
      padding-block-start: var(--8w);
    }

    .section:nth-last-child(1) {
      padding-block-end: var(--8w);
    }
  }
</style>
