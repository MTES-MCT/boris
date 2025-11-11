<script lang="ts">
  import { default as MascotteWaving } from '$assets/icons/mascotte-waving.svg?raw';
  import { onMount } from 'svelte';

  type Props = {
    landbotConfigUrl: string;
  };

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

<section class="fr-container !mt-16 md:!mt-[-6.5rem]">
  <div
    class={`
      relative max-w-[384px] mx-auto mb-[5rem] p-4 rounded-tl-2xl rounded-tr-2xl bg-white
      after:content-[''] after:absolute after:top-[100%] after:left-[calc(50%-2px)] after:w-(--path-thickness) after:h-[5rem] after:bg-blue-primary
    `}>
    <div class="absolute top-[-52px] left-[40px]">
      {@html MascotteWaving}
    </div>
    <h2 class="fr-h4">Voici BoRiS !</h2>
    <p class="fr-mb-0">
      En quelques questions, grâce à sa connaissance des différents dispositifs,
      il vous indiquera votre éligibilité au BRS et vous aiguillera vers
      d'autres outils ou aides.
    </p>
  </div>

  <div
    id="landbot"
    class="h-[90vh] rounded-2xl shadow-lg border-1 border-blue-light">
  </div>
</section>
