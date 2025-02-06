<script lang="ts">
  import GradientBackgroundWrapper from '$components/common/GradientBackgroundWrapper.svelte';
  import Hero from '$components/pages/tout-savoir-sur-le-bail-reel-solidaire-brs/Hero.svelte';
  import Promesse from '$components/pages/tout-savoir-sur-le-bail-reel-solidaire-brs/Promesses.svelte';
  import Steps from '$components/pages/tout-savoir-sur-le-bail-reel-solidaire-brs/Steps.svelte';
  import PageCta from '$components/common/PageCta.svelte';
</script>

<svelte:head>
  <title>Tout savoir sur le BRS - Boris</title>
</svelte:head>

<GradientBackgroundWrapper>
  <Hero />
  <Promesse />
  <Steps />
  <PageCta />
</GradientBackgroundWrapper>
