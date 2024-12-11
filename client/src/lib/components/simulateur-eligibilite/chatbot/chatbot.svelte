<script lang="ts">
  import type { Props } from '$lib/components/simulateur-eligibilite/chatbot/definitions';
  import { default as MascotteWaving } from '$assets/icons/mascotte-waving.svg?raw';
  import { onMount } from 'svelte';

  const { landbotConfigUrl }: Props = $props();

  onMount(async () => {
    // @ts-expect-error cannot find module declaration
    await import('https://cdn.landbot.io/landbot-3/landbot-3.0.0.js');

    // @ts-expect-error cannot find Landbot name
    // eslint-disable-next-line no-undef
    new Landbot.Container({
      container: '#landbot',
      configUrl: landbotConfigUrl,
    });
  });
</script>

<section class="fr-container">
  <div class="disclaimer">
    <div class="mascotte">
      {@html MascotteWaving}
    </div>
    <h2>Voici BoRiS !</h2>
    <p class="fr-mb-0">
      En quelques questions, grâce à sa connaissance des différents dispositifs,
      il vous indiquera votre éligibilité au BRS et vous aiguillera vers
      d'autres outils ou aides.
    </p>
  </div>

  <div
    id="landbot"
    class="landbot">
  </div>
</section>

<style lang="postcss">
  section {
    margin-block-start: var(--6w);
  }

  .disclaimer {
    position: relative;
    max-width: 384px;
    margin: 0 auto;
    margin-block-end: var(--10w);
    padding: 24px;
    border-top-left-radius: var(--border-radius-lg);
    border-top-right-radius: var(--border-radius-lg);
    background-color: white;

    &::after {
      content: '';
      position: absolute;
      top: 100%;
      left: calc(50% - 2px);
      width: var(--path-thickness);
      height: var(--10w);
      background-color: var(--color-blue-primary);
    }
  }

  .mascotte {
    position: absolute;
    top: -52px;
    left: 40px;
  }

  h2 {
    font-size: 1.25rem;
    margin-block-end: var(--1w);
  }

  .landbot {
    height: calc(100vh - var(--12w));
    border-radius: var(--border-radius-sm);
  }

  @media (--sm-viewport) {
    section {
      transform: translateY(calc(-1 * var(--13w)));
    }

    h2 {
      font-size: 1.5rem;
    }
  }
</style>
