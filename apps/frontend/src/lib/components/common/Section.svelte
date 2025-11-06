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
  class="section py-4 md:py-8 nth-1:pt-8 md:nth-1:pt-16 nth-last-1:pb-8 md:nth-last-1:pb-16"
  class:max-w-[636px]={narrow}
  class:mx-auto={narrow}
  class:text-center={narrow}>
  <div class="fr-container">
    <div class="fr-col-12">
      {#if title}
        <svelte:element this={titleElement}>{title}</svelte:element>
      {/if}

      {@render children()}
    </div>
  </div>
</section>
