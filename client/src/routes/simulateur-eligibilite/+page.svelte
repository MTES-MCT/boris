<script lang="ts">
  import GradientBackgroundWrapper from '$components/common/GradientBackgroundWrapper.svelte';
  import Hero from '$components/pages/simulateur-eligibilite/Hero.svelte';
  import Chatbot from '$components/pages/simulateur-eligibilite/Chatbot.svelte';
  import Simulator from '$components/pages/simulateur-eligibilite/Simulator.svelte';
  import PageCta from '$components/common/PageCta.svelte';

  type Props = {
    data: {
      landbotConfigUrl: string;
    };
  };

  const { data }: Props = $props();
</script>

<svelte:head>
  <title>Simuler mon éligibilité - Boris</title>
</svelte:head>

<GradientBackgroundWrapper>
  <Hero />
  <Chatbot landbotConfigUrl={data.landbotConfigUrl} />
  <Simulator />
  <PageCta />
</GradientBackgroundWrapper>
