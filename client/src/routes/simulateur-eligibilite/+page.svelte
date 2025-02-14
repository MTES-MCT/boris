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
  <meta
    name="description"
    content="Utilisez le simulateur BoRiS pour vérifier votre éligibilité au Bail Réel Solidaire (BRS) en quelques étapes." />
</svelte:head>

<GradientBackgroundWrapper>
  <Hero />
  <Chatbot landbotConfigUrl={data.landbotConfigUrl} />
  <Simulator />
  <PageCta />
</GradientBackgroundWrapper>
