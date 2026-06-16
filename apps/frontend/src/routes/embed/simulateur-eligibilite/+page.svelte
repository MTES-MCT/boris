<script lang="ts">
  import { onMount } from 'svelte';
  import EligibilityDefinition from '$components/pages/simulateur-eligibilite/steps/EligibilityDefinition/EligibilityDefinition.svelte';
  import EligibilityResult from '$components/pages/simulateur-eligibilite/steps/EligibilityResult/EligibilityResult.svelte';
  import SearchInformations from '$components/pages/simulateur-eligibilite/steps/SearchInformations/SearchInformations.svelte';
  import Synthesis from '$components/pages/simulateur-eligibilite/steps/Synthesis/Synthesis.svelte';
  import eligibilitySimulatorManager from '$lib/managers/eligibility-simulator.svelte';

  let { data } = $props();

  const { currentStep } = $derived(eligibilitySimulatorManager);

  const validPrimaryColor = $derived(
    /^#[0-9a-fA-F]{6}$/.test(data.primaryColor) ? data.primaryColor : '',
  );
  const validLogoUrl = $derived.by(() => {
    if (!data.logoUrl || !data.parentOrigin) {
      return '';
    }

    try {
      const logoUrl = new URL(data.logoUrl);
      return logoUrl.protocol === 'https:' &&
        logoUrl.origin === new URL(data.parentOrigin).origin
        ? logoUrl.href
        : '';
    } catch {
      return '';
    }
  });

  onMount(() => {
    eligibilitySimulatorManager.configureEmbed({
      parentOrigin: data.parentOrigin,
      selectionDepartments: data.selectionDepartments,
      selectionCitycodes: data.selectionCitycodes,
    });

    const sendHeight = () => {
      window.parent?.postMessage(
        {
          type: 'boris:resize',
          height: document.documentElement.scrollHeight,
        },
        '*',
      );
    };

    const observer = new ResizeObserver(sendHeight);
    observer.observe(document.body);
    sendHeight();

    return () => observer.disconnect();
  });
</script>

<svelte:head>
  <title>Simulateur d'éligibilité au Bail Réel Solidaire - Boris</title>
  <meta
    name="robots"
    content="noindex, nofollow" />
</svelte:head>

<div
  class="embed-shell"
  style={validPrimaryColor ? `--embed-primary-color: ${validPrimaryColor};` : ''}>
  {#if !data.authorized}
    <div class="fr-alert fr-alert--error">
      <h1 class="fr-alert__title">Intégration non autorisée</h1>
      <p>
        L'origine de ce site n'est pas autorisée à intégrer le simulateur Boris.
      </p>
    </div>
  {:else}
    {#if data.intro !== 'none'}
      <header class="embed-header">
        {#if validLogoUrl}
          <img
            class="embed-logo"
            src={validLogoUrl}
            alt="" />
        {/if}
        <div>
          <p class="fr-text--sm fr-mb-1v">
            {data.partnerName || 'Votre OFS'}
          </p>
          {#if data.intro === 'compact'}
            <h1 class="fr-h4 fr-mb-0">
              Vérifier votre éligibilité au bail réel solidaire
            </h1>
          {:else}
            <h1 class="fr-h3 fr-mb-1w">
              Simulateur d'éligibilité au bail réel solidaire
            </h1>
            <p class="fr-text--sm fr-mb-0">
              Obtenez une première estimation, puis laissez vos coordonnées pour
              être accompagné par l'OFS.
            </p>
          {/if}
        </div>
      </header>
    {/if}

    {#if currentStep.step === 1}
      <EligibilityDefinition />
    {:else if currentStep.step === 2}
      <EligibilityResult />
    {:else if currentStep.step === 3}
      <SearchInformations />
    {:else if currentStep.step === 4}
      <Synthesis />
    {/if}

    {#if !data.hideBorisBranding}
      <p class="embed-brand fr-text--xs">Simulateur proposé avec Boris.</p>
    {/if}
  {/if}
</div>

<style>
  .embed-shell {
    padding: 1.5rem;
  }

  .embed-shell :global(.fr-btn) {
    --hover-tint: var(--embed-primary-color, var(--background-action-high-blue-france-hover));
    --active-tint: var(--embed-primary-color, var(--background-action-high-blue-france-active));
    background-color: var(--embed-primary-color, var(--background-action-high-blue-france));
  }

  .embed-header {
    align-items: center;
    border-bottom: 1px solid var(--border-default-grey);
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
  }

  .embed-logo {
    max-height: 3rem;
    max-width: 8rem;
    object-fit: contain;
  }

  .embed-brand {
    color: var(--text-mention-grey);
    margin-top: 2rem;
    text-align: center;
  }

  @media (max-width: 48rem) {
    .embed-shell {
      padding: 1rem;
    }

    .embed-header {
      align-items: flex-start;
      flex-direction: column;
    }
  }
</style>
