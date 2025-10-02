<script lang="ts">
  import Step1 from '$components/pages/simulateur-acquisition/Step1.svelte';
  import Step2 from '$components/pages/simulateur-acquisition/Step2.svelte';
  import Step3 from '$components/pages/simulateur-acquisition/Step3.svelte';
  import Step4 from '$components/pages/simulateur-acquisition/Step4.svelte';
  import Step5 from '$components/pages/simulateur-acquisition/Step5.svelte';
  import Step6 from '$components/pages/simulateur-acquisition/Step6.svelte';

  import acquisitionSimulatorManger from '$lib/managers/acquisition-simulator.svelte';

  const { currentStep } = $derived(acquisitionSimulatorManger);
</script>

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
{/if}
