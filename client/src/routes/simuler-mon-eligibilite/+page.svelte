<script lang="ts">
  import type { Props } from './definitions';
  import Section from '$components/section/section.svelte';
  import { onMount } from 'svelte';

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

<Section
  title="Simuler mon eligibilité"
  titleElement="h1">
  <p>
    Voici BoRiS. En vous posant quelques questions, il pourra vous indiquer
    votre éligibilité au Bail Réel Solidaire (BRS). Grâce à sa connaissance des
    différents dispositifs, il vous aiguillera également vers d'autres outils ou
    des aides vous concernant.
  </p>
  <div id="landbot"></div>
</Section>

<style>
  #landbot {
    height: 1000px;
  }
</style>
