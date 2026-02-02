<script>
  import EligibilityDefinition from '$components/pages/simulateur-eligibilite/steps/EligibilityDefinition/EligibilityDefinition.svelte';
  import Step2 from '$components/pages/simulateur-eligibilite/steps/Step2.svelte';
  import Step3 from '$components/pages/simulateur-eligibilite/steps/Step3.svelte';

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
  <Step2 />
{:else if currentStep.step === 3}
  <Step3 />
{/if}
