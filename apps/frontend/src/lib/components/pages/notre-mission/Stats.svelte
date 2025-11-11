<script lang="ts">
  import Section from '$components/common/Section.svelte';
  import Disclaimer from '$components/common/Disclaimer.svelte';
  import type { Statistic } from '$lib/utils/definitions';

  type Props = {
    statistics: Statistic[];
  };

  const { statistics }: Props = $props();
</script>

<Section id="statistiques">
  <div
    class="max-w-[768px] mx-auto p-4 sm:p-10 rounded-tl-xl rounded-tr-xl bg-white">
    <Disclaimer content="en chiffres clés" />

    <ul class="!list-none !p-0 flex flex-col gap-4 md:gap-8 !mt-12">
      {#each statistics as statistic}
        {@render stat(statistic)}
      {/each}
    </ul>
  </div>
</Section>

{#snippet stat({ amount, subtitle, content }: Statistic)}
  <li class="md:flex md:gap-6 md:items-center">
    <h3 class="md:flex-1 md:text-right fr-mb-0">
      <span class="fr-h2 !m-0">{amount}</span>
      <span class="fr-text--md fr-text--bold fr-mb-0 block">{subtitle}</span>
    </h3>
    <p class="md:flex-1 md:!m-0">{content}</p>
  </li>
{/snippet}
