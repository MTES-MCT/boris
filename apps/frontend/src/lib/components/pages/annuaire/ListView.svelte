<script lang="ts">
  import annuaireManager from '$lib/managers/annuaire.svelte';
  import type {
    BrsDiffusionWebsiteView,
    Pagination as PaginationType,
  } from '$lib/utils/api-types';
  import Card from '$lib/components/pages/annuaire/Card.svelte';
  import Pagination from '$components/common/Pagination.svelte';
  import { default as WomanYoga } from '$assets/illustrations/woman-yoga.svg?raw';
</script>

<div class="fr-container fr-container--fluid">
  <div class="fr-grid-row fr-grid-row--gutters">
    {#if !annuaireManager.hasSearchedTroughAutocomplete}
      {@render hint()}
    {:else if annuaireManager.listBrsDiffusionWebsites}
      {@render content(annuaireManager.listBrsDiffusionWebsites)}
    {/if}
  </div>
</div>

{#snippet content(payload: PaginationType<BrsDiffusionWebsiteView>)}
  {#if payload.items.length > 0}
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
        baseUrl="/annuaire" />
    </div>
  {:else}
    {@render noResult()}
  {/if}
{/snippet}

{#snippet noResult()}
  <div class="fr-col-4"></div>
  <div class="fr-col-4 svg-container">
    <p class="fr-text--lead fr-my-4w">
      <b>Oups, pas de resultats pour votre recherche.</b>
    </p>
    {@html WomanYoga}
  </div>
  <div class="fr-col-4"></div>
{/snippet}

{#snippet hint()}
  <div class="fr-col-12">
    <p>text à définir</p>
  </div>
{/snippet}

<style lang="postcss">
  .fr-text--lead {
    text-align: center;
  }
</style>
