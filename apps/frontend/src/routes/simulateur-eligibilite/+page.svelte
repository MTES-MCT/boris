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
  <title>Suis-je éligible au Bail Réel Solidaire - BRS - BoRiS</title>
  <meta
    name="description"
    content="L'outil de simulation de l'Etat pour savoir si vous êtes éligible au dispositif de Bail Réel Solidaire (BRS)." />
</svelte:head>

<GradientBackgroundWrapper>
  <Hero />
  <Chatbot landbotConfigUrl={data.landbotConfigUrl} />
  <Simulator />
  <PageCta />
</GradientBackgroundWrapper>
