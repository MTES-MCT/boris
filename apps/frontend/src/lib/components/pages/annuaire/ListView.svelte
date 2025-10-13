<script lang="ts">
  import annuaireManager from '$lib/managers/annuaire.svelte';
  import type {
    BrsDiffusionWebsiteView,
    Pagination as PaginationType,
  } from '$lib/utils/api-types';
  import Card from '$lib/components/pages/annuaire/Card.svelte';
  import Pagination from '$components/common/Pagination.svelte';
  import Loader from '$components/common/Loader.svelte';
  import NoResult from './NoResult.svelte';
  import Notice from '$components/common/Notice.svelte';
</script>

<div class="fr-container">
  <div class="fr-container--fluid fr-pb-4w">
    <div class="fr-grid-row fr-grid-row--gutters">
      {#if annuaireManager.isListLoading}
        {@render loading()}
      {:else if !annuaireManager.hasSearchedTroughAutocomplete}
        {@render hint()}
      {:else if annuaireManager.listBrsDiffusionWebsites}
        {@render content(annuaireManager.listBrsDiffusionWebsites)}
      {/if}
    </div>
  </div>
</div>

{#snippet content(payload: PaginationType<BrsDiffusionWebsiteView>)}
  {#if payload.items?.length > 0}
    {#each payload.items as item}
      <div class="fr-col-12 fr-col-md-6">
        <Card
          {...item}
          cardTitleElement="h2" />
      </div>
    {/each}
    <div class="fr-col-12">
      <Pagination
        {...payload}
        baseUrl="/annuaire"
        scrollToElementId="brs-diffusion-websites-filters" />
    </div>
  {:else}
    <div class="fr-col-12">
      <NoResult />
    </div>
  {/if}
{/snippet}

{#snippet loading()}
  {#each Array(24) as _}
    <div class="fr-col-12 fr-col-md-6">
      <Loader height={200} />
    </div>
  {/each}
  <div class="fr-col-12">
    <Loader height={100} />
  </div>
{/snippet}

{#snippet hint()}
  <div class="fr-col-12">
    <Notice
      content="Vous n'avez plus qu'à écrire et sélectionner votre commune de recherche
      dans la barre juste au dessus !">
    </Notice>
  </div>
{/snippet}
