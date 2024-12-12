<script lang="ts">
  import type { Props } from './definitions';
  import Hero from '$components/simulateur-eligibilite/hero/hero.svelte';
  import Chatbot from '$components/simulateur-eligibilite/chatbot/chatbot.svelte';
  import Simulator from '$components/simulateur-eligibilite/simulator/simulator.svelte';
  import PageCta from '$components/pageCta/pageCta.svelte';

  const { data }: Props = $props();
</script>

<svelte:head>
  <title>Boris - Simuler mon éligibilité</title>
</svelte:head>

<div class="background-gradient">
  <Hero />
  <Chatbot landbotConfigUrl={data.landbotConfigUrl} />
  <Simulator />
  <PageCta />
</div>
