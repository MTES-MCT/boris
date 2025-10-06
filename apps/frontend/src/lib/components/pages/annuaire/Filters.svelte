<script lang="ts">
  import Autocomplete from '$components/common/Autocomplete.svelte';
  import Notice from '$components/common/Notice.svelte';
  import Radius from '$components/pages/annuaire/Radius.svelte';
  import Toggle from '$components/pages/annuaire/Toggle.svelte';
  import annuaireManager from '$lib/managers/annuaire.svelte';
  import type { GeocodedResponse } from '$lib/utils/definitions';
  import { getGeocodedResponseLabel } from '$lib/utils/helpers';

  let autocompleteElementRef = $state<HTMLDivElement | null>(null);

  const handleAutocompleteSelect = async (
    suggestion: GeocodedResponse['properties'],
  ) => {
    annuaireManager.isListLoading = true;

    annuaireManager.autocompleteValue = getGeocodedResponseLabel(suggestion);

    annuaireManager.setListBrsDiffusionWebsites({
      coords: {
        latitude: suggestion?.y as number,
        longitude: suggestion?.x as number,
      },
    });

    annuaireManager.zoom = 12;
    annuaireManager.hasSearchedTroughAutocomplete = true;
    annuaireManager.updateMapView = true;

    if (annuaireManager.isMobile) {
      autocompleteElementRef?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  let isNoticeVisible = $derived(
    annuaireManager.viewType === 'map' ||
      (annuaireManager.viewType === 'list' &&
        annuaireManager.listBrsDiffusionWebsites?.totalCount &&
        annuaireManager.listBrsDiffusionWebsites?.totalCount > 0),
  );
</script>

<div
  id="brs-diffusion-websites-filters"
  class="filters fr-container--fluid">
  <div class="fr-grid-row fr-grid-row--gutters">
    <div
      bind:this={autocompleteElementRef}
      class={annuaireManager.viewType === 'list'
        ? 'fr-col-12 fr-col-md-6 fr-col-lg-8'
        : 'fr-col-12 fr-col-md-8 fr-col-lg-10'}>
      <Autocomplete
        bind:value={annuaireManager.autocompleteValue}
        label="Saisir la ville ou le code postal"
        placeholder="Bordeaux, Marseille, Paris"
        onSelect={handleAutocompleteSelect} />
    </div>
    <div
      class={annuaireManager.viewType === 'list'
        ? 'fr-col-12 fr-col-sm-6 fr-col-md-3 fr-col-md-3 fr-col-lg-2'
        : 'fr-hidden'}>
      <Radius />
    </div>
    <div
      class={annuaireManager.viewType === 'list'
        ? 'fr-col-12 fr-col-sm-6 fr-col-md-3 fr-col-lg-2 toggle'
        : 'fr-col-12 fr-col-md-4 fr-col-lg-2 toggle'}>
      <Toggle />
    </div>
  </div>

  {#if annuaireManager.listBrsDiffusionWebsites && annuaireManager.viewType === 'list'}
    <p class="fr-text--sm fr-mt-1w fr-mb-0">
      <b>
        {annuaireManager.listBrsDiffusionWebsites?.totalCount} résulat{annuaireManager
          .listBrsDiffusionWebsites?.totalCount !== 1
          ? 's'
          : ''} pour votre recherche
      </b>
    </p>
  {/if}
</div>

{#if isNoticeVisible}
  <div class="fr-mt-4w">
    <Notice
      content="Attention, nous ne présentons ici uniquement les villes où nous savons que des programmes sont en vente et non directement les programmes" />
  </div>
{/if}

<style lang="postcss">
  .filters {
    --input-background-color: white;

    overflow: visible;
  }

  .toggle {
    display: flex;
    align-items: flex-end;
  }
</style>
