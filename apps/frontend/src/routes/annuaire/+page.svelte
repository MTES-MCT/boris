<script lang="ts">
  import GradientBackgroundWrapper from '$components/common/GradientBackgroundWrapper.svelte';
  import Section from '$components/common/Section.svelte';
  import Filters from '$components/pages/annuaire/Filters.svelte';
  import type { DataType } from './+page';
  import ListView from '$components/pages/annuaire/ListView.svelte';
  import annuaireManager from '$lib/managers/annuaire.svelte';
  import MapView from '$components/pages/annuaire/MapView.svelte';

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
        {#if annuaireManager.viewType === 'map'}
          <MapView />
        {:else}
          <ListView brsDiffusionWebsites={data.brsDiffusionWebsites} />
        {/if}
      </div>
    </div>
  </Section>
</GradientBackgroundWrapper>

<style lang="postcss">
  .fr-container--fluid {
    overflow: visible;
  }
</style>
