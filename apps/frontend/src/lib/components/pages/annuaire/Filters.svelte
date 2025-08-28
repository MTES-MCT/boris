<script lang="ts">
  import Autocomplete from '$components/pages/annuaire/Autocomplete.svelte';
  import Radius from '$components/pages/annuaire/Radius.svelte';
  import Toggle from '$components/pages/annuaire/Toggle.svelte';
  import annuaireManager from '$lib/managers/annuaire.svelte';
</script>

<div class="fr-container--fluid">
  <div class="fr-grid-row fr-grid-row--gutters">
    <div class="fr-col-12 fr-col-md-6 fr-col-lg-8">
      <Autocomplete />
    </div>
    <div class="fr-col-12 fr-col-sm-6 fr-col-md-3 fr-col-md-3 fr-col-lg-2">
      <Radius />
    </div>
    <div class="fr-col-12 fr-col-sm-6 fr-col-md-3 fr-col-lg-2 toggle">
      <Toggle />
    </div>
  </div>

  {#if annuaireManager.brsDiffusionWebsites}
    <p class="fr-text--sm fr-mt-1w fr-mb-0">
      <b>
        {annuaireManager.brsDiffusionWebsites?.totalCount} résulat{annuaireManager
          .brsDiffusionWebsites?.totalCount !== 1
          ? 's'
          : ''} pour votre recherche
      </b>
    </p>
  {/if}
</div>

<style lang="postcss">
  .fr-container--fluid {
    --input-background-color: white;

    overflow: visible;
  }

  .toggle {
    display: flex;
    align-items: flex-end;
  }
</style>
