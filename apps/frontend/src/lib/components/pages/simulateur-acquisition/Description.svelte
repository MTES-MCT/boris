<script lang="ts">
  import type { Snippet } from 'svelte';

  import Stepper from '$components/common/Stepper.svelte';

  import acquisitionSimulatorManger from '$lib/managers/acquisition-simulator.svelte';

  let { steps, currentStep, nextStep } = $derived(acquisitionSimulatorManger);

  type Props = {
    content: string;
  };

  const { content }: Props = $props();
</script>

<div class="fr-col-7 fr-pr-10w">
  <Stepper
    title={`${currentStep.step}. ${currentStep.title}`}
    nextStepTitle={nextStep?.title}
    currentStep={currentStep.step}
    stepCount={steps.length} />
  <p>
    {content}
  </p>
</div>
