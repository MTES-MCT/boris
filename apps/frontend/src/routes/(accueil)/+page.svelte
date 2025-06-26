<script lang="ts">
  import Hero from '$components/pages/accueil/Hero.svelte';
  import GradientBackgroundWrapper from '$components/common/GradientBackgroundWrapper.svelte';
  import Promesse from '$components/pages/accueil/Promesses.svelte';
  import Infos from '$components/pages/accueil/Infos.svelte';
  import Verbatims from '$components/pages/accueil/Verbatims.svelte';
  import PageCta from '$components/common/PageCta.svelte';
</script>

<svelte:head>
  <title>La plateforme officielle du Bail Réel Solidaire - BRS - BoRiS</title>
  <meta
    name="description"
    content="Retrouvez toutes les informations de l'Etat sur le parcours d’achat en Bail Réel Solidaire (BRS). Vérifiez votre éligibilité et trouvez un logement en vente." />
</svelte:head>

<Hero />

<GradientBackgroundWrapper>
  <Promesse />
  <Infos />
  <Verbatims />
  <PageCta />
</GradientBackgroundWrapper>
