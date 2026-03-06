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
      La troisième étape du simulateur BoRiS consiste à recueillir les
      informations adaptées à votre situation personnelle, afin de vous orienter
      vers des aides particulières et des professionnel·les du BRS qui pourront
      vous recontacter.
    </p>
    <ol class="!mb-8">
      <li class="fr-text--bold">{currentStep.phases[0]?.title}</li>
      <li class="fr-text--bold">{currentStep.phases[1]?.title}</li>
      <li class="fr-text--bold">{currentStep.phases[2]?.title}</li>
    </ol>
  </Description>

  {#if currentPhase.phase === 1}
    <HousingInformations />
  {:else if currentPhase.phase === 2}
    <FinancialInformations />
  {:else if currentPhase.phase === 3}
    <AdditionalInformations />
  {/if}
</Wrapper>
