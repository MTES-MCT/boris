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
    title="Trouver un logement en Bail Réel Solidaire"
    titleElement="h1">
    <p>
      Vous êtes sur la carte de France du BRS qui répertorie les <strong>
        logements BRS actuellement en cours de commercialisation
      </strong>
      .
    </p>
    <p>
      Pour chaque logement, vous pouvez consulter sa localisation et accéder à
      la page du programme immobilier correspondant pour obtenir les
      informations détaillées sur le logement, les prix et les modalités
      d'achat.
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

  <Section
    title="Les logements BRS disponibles"
    titleElement="h2">
    <p>
      Vous recherchez un <strong>logement en BRS</strong>
      pour acheter votre résidence principale ?
    </p>
    <p>
      Parcourez les programmes actuellement en cours de commercialisations pour
      découvrir les logements en BRS proposés à la vente.
    </p>
    <p><strong>Recherchez un bien selon sa localisation</strong></p>
    <p>
      <strong>Cliquez sur un programme</strong>
      pour être redirigé vers la page du programme et consulter les appartements
      en BRS à vendre, les maisons en BRS à vendre dans le cadre de ce programme
    </p>
    <p>
      Les disponibilités, les prix et les conditions de commercialisation sont
      susceptibles d'évoluer. Les informations les plus récentes sont
      disponibles sur la page du programme.
    </p>
  </Section>

  <Section
    title="Acheter un logement en Bail Réel Solidaire"
    titleElement="h2">
    <p>
      Le <strong>Bail Réel Solidaire (BRS)</strong>
      permet d'acheter sa résidence principale à un prix inférieur à celui du marché.
      Le dispositif repose sur la dissociation entre le foncier, détenu par un Organisme
      de Foncier Solidaire (OFS), et le logement, acheté par le ménage.
    </p>
    <p>
      Pour acheter un logement en BRS, vous devez notamment respecter certaines
      conditions liées à vos ressources et au fait que le logement constitue
      votre résidence principale. Pour tout savoir sur le bail réel solidaire,
      consultez la page :
      <a
        href="https://boris.beta.gouv.fr/tout-savoir-sur-le-bail-reel-solidaire-brs"
        target="_blank"
        rel="noopener noreferrer">
        Tout savoir sur le Bail Réel Solidaire (BRS)
      </a>
    </p>

    <h3>Comment trouver un logement BRS ?</h3>
    <p><strong>1. Recherchez votre secteur</strong></p>
    <p>
      Explorez la carte pour trouver les logements BRS proposés à la vente dans
      la ville ou le secteur où vous souhaitez acheter.
    </p>

    <p><strong>2. Choisissez un programme</strong></p>
    <p>Cliquez sur un programme proche de chez vous</p>

    <p><strong>3. Consultez le programme</strong></p>
    <p>
      Accédez directement à la page du programme pour connaître les logements
      proposés, les prix et les modalités de commercialisation.
    </p>
    <h3>Vous souhaitez acheter en BRS ?</h3>
    <p>
      Vérifiez votre éligibilité au Bail Réel Solidaire avant de rechercher
      votre futur logement : <a
        href="https://boris.beta.gouv.fr/simulateur-eligibilite"
        target="_blank"
        rel="noopener noreferrer">
        Simulateur d'éligibilité
      </a>
    </p>
  </Section>
</GradientBackgroundWrapper>
