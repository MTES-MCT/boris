<script lang="ts">
  import GradientBackgroundWrapper from '$components/common/GradientBackgroundWrapper.svelte';
  import Section from '$components/common/Section.svelte';
  import Filters from '$components/pages/annuaire/Filters.svelte';
  import type { DataType } from './+page';
  import ListView from '$components/pages/annuaire/ListView.svelte';
  import annuaireManager from '$lib/managers/annuaire.svelte';
  import MapView from '$components/pages/annuaire/MapView.svelte';
  import { browser } from '$app/environment';
  import Notice from '$components/common/Notice.svelte';

  type Props = {
    data: DataType;
  };

  const { data }: Props = $props();
</script>

<svelte:head>
  <title>Trouver un logement en Bail Réel Solidaire - BoRiS</title>
  <meta
    name="description"
    content="Annuaire des sites de diffusion du BRS" />
</svelte:head>

<GradientBackgroundWrapper>
  <Section
    title="Trouver un logement en Bail Réel Solidaire disponible à l’achat"
    titleElement="h1">
    <p>
      Nous répertorions les sites internet de nos partenaires qui proposent des
      logements en Bail Réel Solidaire (BRS) à la vente. Notre annuaire vous
      permet d'identifier facilement les villes où des programmes sont en cours
      de commercialisation, et de pouvoir ensuite visiter les sites d'annonces
      pour trouver les programmes spécifiques. Il n'y a plus qu'à faire sa
      recherche !
    </p>
    <p>
      Attention cependant, notre annuaire n'indique pas précisément
      l'emplacement des programmes en vente. Chaque lien vous redirige vers la
      page programme de l'Organismes de Foncier Solidaires (OFS) ou de son
      commercialisateur qui présente au moins un programme dans votre ville de
      recherche. Vous pourrez y consulter les logements en BRS disponibles à
      l'achat ou prendre contact pour trouver un logement en Bail Réel
      Solidaire.
    </p>
  </Section>

  <Section
    title="Filtres"
    titleElement="h3">
    <Filters />
  </Section>

  {#if annuaireManager.viewType === 'map'}
    <MapView brsDiffusionWebsites={data.mapBrsDiffusionWebsites} />
  {:else}
    <ListView />
  {/if}
</GradientBackgroundWrapper>
