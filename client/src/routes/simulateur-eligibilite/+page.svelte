<script lang="ts">
  import type { Props } from './definitions';
  import { onMount } from 'svelte';
  import Hero from '$components/simulateur-eligibilite/hero/hero.svelte';

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

<div class="background-gradient">
  <Hero />

  <div
    id="landbot"
    class="fr-mt-3w fr-mt-md-6w background-alt-raised-grey">
  </div>
</div>

<style lang="postcss">
  #landbot {
    height: calc(100vh - var(--12w));
    border-radius: var(--border-radius-sm);
  }

  @media (--sm-viewport) {
    height: 800px;
  }
</style>
