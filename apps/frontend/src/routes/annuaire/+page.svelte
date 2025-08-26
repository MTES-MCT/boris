<script lang="ts">
  import GradientBackgroundWrapper from '$components/common/GradientBackgroundWrapper.svelte';
  import Pagination from '$components/common/Pagination.svelte';
  import Section from '$components/common/Section.svelte';
  import Card from '$components/pages/annuaire/Card.svelte';
  import Filters from '$components/pages/annuaire/Filters.svelte';
  import type { DataType } from './+page.server';
  import annuaireManager from '$lib/managers/annuaire.svelte';
  import { default as WomanYoga } from '$assets/illustrations/woman-yoga.svg?raw';

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
        {#if annuaireManager.brsDiffusionWebsites}
          {#if annuaireManager.brsDiffusionWebsites.items.length > 0}
            {@render content(annuaireManager.brsDiffusionWebsites)}
          {:else}
            {@render noResult()}
          {/if}
        {:else}
          {@render content(data.brsDiffusionWebsites)}
        {/if}
      </div>
    </div>
  </Section>
</GradientBackgroundWrapper>

{#snippet content(payload: DataType['brsDiffusionWebsites'])}
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
  .fr-container--fluid {
    overflow: visible;
  }

  .fr-text--lead {
    text-align: center;
  }
</style>
