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
    content="Découvrez le Bail Réel Solidaire (BRS), vérifiez votre éligibilité et trouvez un logement abordable grâce aux informations officielles de l'État." />
  <meta
    name="google-site-verification"
    content="XsW67VGWzF9jXJpdRrNGgpXSYSN3YAxW8jDfLIFL5-o" />
</svelte:head>

<Hero />

<GradientBackgroundWrapper>
  <Promesse />
  <Infos />
  <Verbatims />
  <PageCta />
</GradientBackgroundWrapper>
