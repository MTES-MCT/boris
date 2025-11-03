<script lang="ts">
  import type { Statistic } from '$lib/utils/definitions';

  import Section from '$components/common/Section.svelte';
  import Disclaimer from '$components/common/Disclaimer.svelte';
  import Tile from '$components/common/Tile.svelte';

  type Props = {
    statistics: Statistic[];
  };

  const { statistics }: Props = $props();
</script>

<div>
  <Section id="statistiques">
    <div
      class="content fr-p-3w fr-p-md-5w fr-m-auto rounded-box-md background-color-white">
      <Disclaimer content="en chiffres clés" />

      <div class="fr-container--fluid fr-mt-5w">
        <div class="fr-grid-row fr-grid-row--gutters">
          {#each statistics as statistic, index}
            {@const isLast = index === statistics.length - 1}
            <div
              class="fr-col-12 fr-col-sm-6"
              class:fr-col-sm-12={isLast}>
              <Tile
                title={statistic.amount}
                description={statistic.subtitle}
                detail={statistic.content}
                pictogram={statistic.pictogram} />
            </div>
          {/each}
        </div>
      </div>
    </div>
  </Section>
</div>

<style lang="postcss">
  .content {
    max-width: 768px;
  }
</style>
