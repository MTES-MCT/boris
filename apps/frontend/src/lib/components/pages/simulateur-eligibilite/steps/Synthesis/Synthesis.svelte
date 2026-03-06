<script lang="ts">
  import Description from '$components/common/Simulator/Description.svelte';
  import Wrapper from '$components/common/Simulator/Wrapper.svelte';

  import eligibilitySimulatorManager from '$lib/managers/eligibility-simulator.svelte';
  import SynthesisContent from '$components/pages/simulateur-eligibilite/steps/Synthesis/SynthesisContent.svelte';

  const { currentStep, steps, currentPhase } = $derived(
    eligibilitySimulatorManager,
  );
</script>

<Wrapper>
  <Description
    title="Simulateur d'éligibilité"
    stepTitle={`${currentStep.step}. ${currentStep.title}`}
    currentStep={currentStep.step}
    stepCount={steps.length}>
    <p>
      Retrouvez la synthèse des informations que vous avez renseignées dans le
      simulateur.
    </p>
  </Description>

  {#if currentPhase.phase === 1}
    <SynthesisContent />
  {/if}
</Wrapper>
