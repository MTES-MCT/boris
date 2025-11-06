<script lang="ts">
  import type { Snippet } from 'svelte';

  import Stepper from '$components/common/Stepper.svelte';

  import acquisitionSimulatorManager from '$lib/managers/acquisition-simulator.svelte';

  let { steps, currentStep, nextStep } = $derived(acquisitionSimulatorManager);

  type Props = {
    children: Snippet;
  };

  const { children }: Props = $props();
</script>

<div
  class="p-4 sm:p-8 lg:py-32 lg:px-8 lg:flex lg:justify-end lg:!w-[calc(50%-6rem)]">
  <div class="w-full lg:max-w-[28rem]">
    <h1 class="!text-[2.3rem] underline">Simulateur d'acquisition</h1>
    <div>
      <Stepper
        title={`${currentStep.step}. ${currentStep.title}`}
        nextStepTitle={nextStep?.title}
        currentStep={currentStep.step}
        stepCount={steps.length} />
      {@render children()}
    </div>
  </div>
</div>
