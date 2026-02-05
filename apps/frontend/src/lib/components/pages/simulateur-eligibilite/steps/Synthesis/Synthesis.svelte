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
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus ullam
      corrupti dolores. Placeat autem obcaecati consectetur illum aperiam dicta
      eaque. Et tempore atque totam culpa itaque omnis ullam sequi vel!
    </p>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore obcaecati
      corporis numquam sint quia enim reiciendis porro! Modi omnis fuga
      similique totam harum! Voluptates eaque beatae consequatur nemo, libero
      asperiores.
    </p>
  </Description>

  {#if currentPhase.phase === 1}
    <SynthesisContent />
  {/if}
</Wrapper>
