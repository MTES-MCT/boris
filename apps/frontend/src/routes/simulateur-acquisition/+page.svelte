<script lang="ts">
  import Step1 from '$components/pages/simulateur-acquisition/Step1.svelte';
  import Step2 from '$components/pages/simulateur-acquisition/Step2.svelte';
  import Step3 from '$components/pages/simulateur-acquisition/Step3.svelte';
  import Step4 from '$components/pages/simulateur-acquisition/Step4.svelte';
  import Step5 from '$components/pages/simulateur-acquisition/Step5.svelte';
  import Step6 from '$components/pages/simulateur-acquisition/Step6.svelte';
  import Step7 from '$components/pages/simulateur-acquisition/Step7.svelte';
  import Step8 from '$components/pages/simulateur-acquisition/Step8.svelte';

  import acquisitionSimulatorManager from '$lib/managers/acquisition-simulator.svelte';

  const { currentStep } = $derived(acquisitionSimulatorManager);
</script>

<svelte:head>
  <title>Simulateur d'acquisition - Boris</title>
  <meta
    name="description"
    content="Simulez les frais liés à l'acquisition d'un logement en Bail Réel Solidaire (BRS), du financement aux différentes charges liées à la propriété en BRS." />
</svelte:head>

{#if currentStep.step === 1}
  <Step1 />
{:else if currentStep.step === 2}
  <Step2 />
{:else if currentStep.step === 3}
  <Step3 />
{:else if currentStep.step === 4}
  <Step4 />
{:else if currentStep.step === 5}
  <Step5 />
{:else if currentStep.step === 6}
  <Step6 />
{:else if currentStep.step === 7}
  <Step7 />
{:else if currentStep.step === 8}
  <Step8 />
{/if}
