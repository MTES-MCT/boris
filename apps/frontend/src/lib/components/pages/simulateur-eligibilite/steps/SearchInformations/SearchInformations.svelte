<script lang="ts">
  import Description from '$components/common/Simulator/Description.svelte';
  import Wrapper from '$components/common/Simulator/Wrapper.svelte';

  import eligibilitySimulatorManager from '$lib/managers/eligibility-simulator.svelte';
  import HousingInformations from '$components/pages/simulateur-eligibilite/steps/SearchInformations/HousingInformations.svelte';
  import FinancialInformations from '$components/pages/simulateur-eligibilite/steps/SearchInformations/FinancialInformations.svelte';
  import AdditionalInformations from './AdditionalInformations.svelte';

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
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Porro, cumque,
      quae, molestias numquam vero reiciendis nihil voluptates repellendus
      itaque eos repellat sequi? Asperiores ea modi quis quia, quam beatae
      architecto.
    </p>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora nam
      obcaecati est recusandae expedita in, officia vel fuga ab perferendis
      accusamus explicabo temporibus. Alias molestiae, aliquid hic incidunt rem
      voluptatibus!
    </p>
  </Description>

  {#if currentPhase.phase === 1}
    <HousingInformations />
  {:else if currentPhase.phase === 2}
    <FinancialInformations />
  {:else if currentPhase.phase === 3}
    <AdditionalInformations />
  {/if}
</Wrapper>
