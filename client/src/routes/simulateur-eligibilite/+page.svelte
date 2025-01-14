<script lang="ts">
  import type { Props } from './definitions';
  import Hero from '$components/pages/simulateur-eligibilite/Hero.svelte';
  import Chatbot from '$components/pages/simulateur-eligibilite/Chatbot.svelte';
  import Simulator from '$components/pages/simulateur-eligibilite/Simulator.svelte';
  import PageCta from '$components/common/PageCta.svelte';

  const { data }: Props = $props();
</script>

<svelte:head>
  <title>Simuler mon éligibilité - Boris</title>
</svelte:head>

<div class="background-gradient">
  <Hero />
  <Chatbot landbotConfigUrl={data.landbotConfigUrl} />
  <Simulator />
  <PageCta />
</div>
