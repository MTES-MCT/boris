<script lang="ts">
  import annuaireManager from '$lib/managers/annuaire.svelte';
  import type {
    BrsDiffusionWebsiteView,
    Pagination as PaginationType,
  } from '$lib/utils/api-types';
  import Card from '$lib/components/pages/annuaire/Card.svelte';
  import Pagination from '$components/common/Pagination.svelte';
  import { default as WomanYoga } from '$assets/illustrations/woman-yoga.svg?raw';
  import { noConflict } from 'leaflet';

  type Props = {
    brsDiffusionWebsites: PaginationType<BrsDiffusionWebsiteView>;
  };

  const { brsDiffusionWebsites }: Props = $props();

  $inspect(annuaireManager.brsDiffusionWebsites);
</script>

{#if annuaireManager.brsDiffusionWebsites}
  {@render content(annuaireManager.brsDiffusionWebsites)}
{:else}
  {@render content(brsDiffusionWebsites)}
{/if}

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

<style lang="postcss">
  .fr-text--lead {
    text-align: center;
  }
</style>
