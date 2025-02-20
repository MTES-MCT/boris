<script lang="ts">
  import Hero from '$components/pages/accueil/Hero.svelte';
  import GradientBackgroundWrapper from '$components/common/GradientBackgroundWrapper.svelte';
  import Promesse from '$components/pages/accueil/Promesses.svelte';
  import Infos from '$components/pages/accueil/Infos.svelte';
  import Verbatims from '$components/pages/accueil/Verbatims.svelte';
  import PageCta from '$components/common/PageCta.svelte';
</script>

<svelte:head>
  <title>Accueil - Boris</title>
  <meta
    name="description"
    content="BoRiS aide à l'accès à la propriété en Bail Réel Solidaire (BRS)" />
</svelte:head>

<button
  onclick={() => {
    throw new Error('Error from sentryyyyyyy');
  }}>
</button>

<Hero />

<GradientBackgroundWrapper>
  <Promesse />
  <Infos />
  <Verbatims />
  <PageCta />
</GradientBackgroundWrapper>
