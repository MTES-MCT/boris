<script>
  import EligibilityDefinition from '$components/pages/simulateur-eligibilite/steps/EligibilityDefinition/EligibilityDefinition.svelte';
  import EligibilityResult from '$components/pages/simulateur-eligibilite/steps/EligibilityResult/EligibilityResult.svelte';
  import SearchInformations from '$components/pages/simulateur-eligibilite/steps/SearchInformations/SearchInformations.svelte';
  import Synthesis from '$components/pages/simulateur-eligibilite/steps/Synthesis/Synthesis.svelte';

  import eligibilitySimulatorManager from '$lib/managers/eligibility-simulator.svelte';

  const { currentStep } = $derived(eligibilitySimulatorManager);
</script>

<svelte:head>
  <title>Simulateur d'éligibilité au Bail Réel Solidaire - BoRiS</title>
  <meta
    name="description"
    content="Simulez votre éligibilité au Bail Réel Solidaire (BRS) avec le simulateur de BoRiS." />
</svelte:head>

{#if currentStep.step === 1}
  <EligibilityDefinition />
{:else if currentStep.step === 2}
  <EligibilityResult />
{:else if currentStep.step === 3}
  <SearchInformations />
{:else if currentStep.step === 4}
  <Synthesis />
{/if}
