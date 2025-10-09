<script lang="ts">
  import Stepper from '$components/common/Stepper.svelte';

  import acquisitionSimulatorManager from '$lib/managers/acquisition-simulator.svelte';

  let { steps, currentStep, nextStep } = $derived(acquisitionSimulatorManager);

  type Props = {
    content: string;
  };

  const { content }: Props = $props();
</script>

<div class="container">
  <div class="content">
    <h1>Simulateur d'acquisition</h1>
    <div>
      <Stepper
        title={`${currentStep.step}. ${currentStep.title}`}
        nextStepTitle={nextStep?.title}
        currentStep={currentStep.step}
        stepCount={steps.length} />
      <p>
        {content}
      </p>
    </div>
  </div>
</div>

<style lang="postcss">
  .container {
    padding: 1rem;
  }

  @media (--xs-viewport) {
    .container {
      padding: 2rem;
    }
  }

  @media (--md-viewport) {
    h1 {
      font-size: 2.3rem;
      text-decoration: underline;
    }

    .container {
      padding-inline: 2rem;
      padding-block: 8rem;
      display: flex;
      justify-content: flex-end;
      width: calc(50% - 6rem);
    }

    .content {
      max-width: 28rem;
    }
  }
</style>
