<script lang="ts">
  import type { PageProps } from './$types';

  import GradientBackgroundWrapper from '$components/common/GradientBackgroundWrapper.svelte';
  import Hero from '$components/pages/simulateur-eligibilite/Hero.svelte';
  import SimulationCta from '$components/pages/simulateur-eligibilite/SimulationCta.svelte';
  import EligibilityTresholds from '$components/common/EligibilityTresholds.svelte';
  import PageCta from '$components/common/PageCta.svelte';
</script>

<svelte:head>
  <title>Suis-je éligible au Bail Réel Solidaire - BRS - BoRiS</title>
  <meta
    name="description"
    content="L'outil de simulation de l'Etat pour savoir si vous êtes éligible au dispositif de Bail Réel Solidaire (BRS)." />
</svelte:head>

<GradientBackgroundWrapper>
  <Hero />
  <SimulationCta />
  <EligibilityTresholds />
  <PageCta />
</GradientBackgroundWrapper>
