<script lang="ts">
  import type { PageProps } from './$types';

  import GradientBackgroundWrapper from '$components/common/GradientBackgroundWrapper.svelte';
  import Section from '$components/common/Section.svelte';
  import Filters from '$components/pages/annuaire/Filters.svelte';
  import ListView from '$components/pages/annuaire/ListView.svelte';
  import annuaireManager from '$lib/managers/annuaire.svelte';
  import MapView from '$components/pages/annuaire/MapView.svelte';

  const { data }: PageProps = $props();
</script>

<svelte:head>
  <title>Trouver un logement en Bail Réel Solidaire - BoRiS</title>
  <meta
    name="description"
    content="Trouvez un logement en BRS: consultez les biens en BRS disponibles à l'achat partout en France. Appartements et maisons en bail réel solidaire." />
</svelte:head>

<GradientBackgroundWrapper>
  <Section
    title="Trouver un logement en Bail Réel Solidaire disponible à l'achat"
    titleElement="h1">
    <p>
      Nous répertorions les sites internet de nos partenaires qui proposent des
      logements en bail réel solidaire (BRS) à la vente. Notre annuaire vous
      permet d'identifier facilement les villes où des logements sont
      disponibles à l'achat en bail réel solidaire, et vous propose de visiter
      ensuite les sites d'annonces pour voir les offres de logements à vendre.
      Il n'y a plus qu'à faire sa recherche !
    </p>
    <p>
      Attention cependant, <b>
        notre annuaire n'indique pas précisément l'emplacement des programmes en
        vente
      </b>
      . Chaque lien vous redirige vers le site web de
      <a
        href="/organismes-de-foncier-solidaire"
        class="fr-link">
        l'organisme de foncier solidaire (OFS)
      </a>
      ou de son commercialisateur qui présente au moins un programme dans votre ville
      de recherche. Rendez-vous sur le(s) lien(s) qui s'affiche(nt) pour consulter
      le détail des logements en bail réel solidaire (BRS) disponibles à l'achat
      et prendre contact avec l'Organisme de Foncier Solidaire.
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
