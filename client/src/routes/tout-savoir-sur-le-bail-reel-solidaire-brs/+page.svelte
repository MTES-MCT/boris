<script lang="ts">
  import Hero from '$components/tout-savoir-sur-le-bail-reel-solidaire-brs/hero/hero.svelte';
  import Promesse from '$components/tout-savoir-sur-le-bail-reel-solidaire-brs/promesse/promesse.svelte';
  import PageCta from '$components/pageCta/pageCta.svelte';
  import Steps from '$components/tout-savoir-sur-le-bail-reel-solidaire-brs/steps/steps.svelte';
</script>

<svelte:head>
  <title>Boris - Tout savoir sur le BRS</title>
</svelte:head>

<div class="background-gradient">
  <Hero />
  <Promesse />
  <Steps />
  <PageCta />
</div>
