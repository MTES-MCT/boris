<script lang="ts">
  import Autocomplete from '$components/pages/annuaire/Autocomplete.svelte';
  import Radius from '$components/pages/annuaire/Radius.svelte';
  import Toggle from '$components/pages/annuaire/Toggle.svelte';
  import annuaireManager from '$lib/managers/annuaire.svelte';
</script>

<div class="filters fr-container--fluid">
  <p class="fr-h3"><b>Filtres</b></p>
  <div class="fr-grid-row fr-grid-row--gutters">
    <div
      class={annuaireManager.viewType === 'list'
        ? 'fr-col-12 fr-col-md-6 fr-col-lg-8'
        : 'fr-col-12 fr-col-md-8 fr-col-lg-10'}>
      <Autocomplete />
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

<style lang="postcss">
  .filters {
    --input-background-color: white;

    overflow: visible;
  }

  .toggle {
    display: flex;
    align-items: flex-end;
  }

  .fr-h3 {
    margin-top: var(--4w);

    @media (--lg-viewport) {
      margin-top: var(--6w);
    }
  }
</style>
