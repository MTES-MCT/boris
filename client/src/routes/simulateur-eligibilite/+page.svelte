<script lang="ts">
  import type { Props } from './definitions';
  import Hero from '$lib/components/simulateur-eligibilite/hero/hero.svelte';
  import Chatbot from '$components/simulateur-eligibilite/chatbot/chatbot.svelte';

  const { data }: Props = $props();
</script>

<svelte:head>
  <title>Boris - Simuler mon éligibilité</title>
</svelte:head>

<div class="background-gradient">
  <Hero />
  <Chatbot landbotConfigUrl={data.landbotConfigUrl} />
</div>
