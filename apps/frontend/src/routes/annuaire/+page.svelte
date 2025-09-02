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
    <Filters />
  </Section>
  {#if annuaireManager.viewType === 'map'}
    <MapView brsDiffusionWebsites={data.mapBrsDiffusionWebsites} />
  {:else}
    <ListView brsDiffusionWebsites={data.listBrsDiffusionWebsites} />
  {/if}
</GradientBackgroundWrapper>
