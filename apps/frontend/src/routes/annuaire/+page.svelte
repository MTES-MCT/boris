<script lang="ts">
  import GradientBackgroundWrapper from '$components/common/GradientBackgroundWrapper.svelte';
  import Pagination from '$components/common/Pagination.svelte';
  import Section from '$components/common/Section.svelte';
  import Card from '$components/pages/annuaire/Card.svelte';
  import Filters from '$components/pages/annuaire/Filters.svelte';
  import type { DataType } from './+page.server';

  type Props = {
    data: DataType;
  };

  const { data }: Props = $props();
</script>

<svelte:head>
  <title>Annuaire des sites de diffusion du BRS - BoRiS</title>
  <meta
    name="description"
    content="Annuaire des sites de diffusion du BRS" />
</svelte:head>

<GradientBackgroundWrapper>
  <Section
    title="Annuaire des sites de diffusion du BRS"
    titleElement="h1">
    <div class="fr-container--fluid fr-mb-4w">
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-12">
          <Filters />
        </div>
        {#each data.brsDiffusionWebsites.items as item}
          <div class="fr-col-12 fr-col-md-6">
            <Card
              {...item}
              cardTitleElement="h2" />
          </div>
        {/each}
        <div class="fr-col-12">
          <Pagination
            {...data.brsDiffusionWebsites}
            baseUrl="/annuaire" />
        </div>
      </div>
    </div>
  </Section>
</GradientBackgroundWrapper>

<style lang="postcss">
  .fr-container--fluid {
    overflow: visible;
  }
</style>
