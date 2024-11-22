<script lang="ts">
  import type { Props } from './definitions';
  import { onMount } from 'svelte';
  import Section from '$components/section/section.svelte';
  import Data from '$components/simuler-mon-eligibilite/data.svelte';

  const { data }: Props = $props();

  onMount(async () => {
    // @ts-expect-error cannot find module declaration
    await import('https://cdn.landbot.io/landbot-3/landbot-3.0.0.js');

    // @ts-expect-error cannot find Landbot name
    // eslint-disable-next-line no-undef
    new Landbot.Container({
      container: '#landbot',
      configUrl: data.landbotConfigUrl,
    });
  });
</script>

<svelte:head>
  <title>Boris - Simuler mon éligibilité</title>
</svelte:head>

<Section
  title="Simuler mon eligibilité"
  titleElement="h1">
  <p>
    Voici BoRiS. En vous posant quelques questions, il pourra vous indiquer
    votre éligibilité au Bail Réel Solidaire (BRS). Grâce à sa connaissance des
    différents dispositifs, il vous aiguillera également vers d'autres outils ou
    des aides vous concernant.
  </p>
  <div
    id="landbot"
    class="fr-mt-3w fr-mt-md-6w background-alt-raised-grey">
  </div>
</Section>

<Section title="Plafonds de ressources d'éligibilité au BRS">
  <Data />
</Section>

<style lang="postcss">
  #landbot {
    height: calc(100vh - var(--12w));
    border-radius: var(--border-radius);
  }

  @media (--sm-viewport) {
    height: 800px;
  }
</style>
