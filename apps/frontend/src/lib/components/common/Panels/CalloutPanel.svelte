<script lang="ts">
  import type { Snippet } from 'svelte';

  import { mascottes } from '$lib/utils/mascottes';

  type Props = {
    title: string;
    mascotte?: keyof typeof mascottes;
    children: Snippet;
  };

  const { title, mascotte, children }: Props = $props();
</script>

<section
  class={`
    relative mx-auto mt-12 xl:mt-24 w-[calc(100%-2rem)] max-w-[992px] z-10 rounded-tl-2xl rounded-tr-2xl border-4 border-red-primary xl:border-0
    xl:after:content-[''] xl:after:absolute xl:after:bottom-20 xl:after:left-20 xl:after:w-full xl:after:h-full xl:after:border-4 xl:after:border-red-primary xl:after:rounded-2xl xl:after:-z-10
  `}>
  <div class="relative rounded-tl-xl rounded-tr-xl py-8 px-4 md:px-8 bg-white">
    <h2 class="text-center !mb-12 !text-blue-primary">{title}</h2>

    <div class="fr-grid-row fr-grid-row--gutters">
      {@render children()}
    </div>

    {#if mascotte}
      <div class="absolute top-[-56px] xl:top-[-52px] right-32">
        {@html mascottes[mascotte]}
      </div>
    {/if}
  </div>
</section>
