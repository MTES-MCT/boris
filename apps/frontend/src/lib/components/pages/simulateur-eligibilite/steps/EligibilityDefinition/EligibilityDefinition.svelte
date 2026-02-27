<script lang="ts">
  import Notice from '$components/common/Notice.svelte';
  import Description from '$components/common/Simulator/Description.svelte';
  import Wrapper from '$components/common/Simulator/Wrapper.svelte';

  import eligibilitySimulatorManager from '$lib/managers/eligibility-simulator.svelte';
  import FiscalRevenues from '$components/pages/simulateur-eligibilite/steps/EligibilityDefinition/FiscalRevenues.svelte';
  import HouseholdComposition from '$components/pages/simulateur-eligibilite/steps/EligibilityDefinition/HouseholdComposition.svelte';
  import PropertySituation from '$components/pages/simulateur-eligibilite/steps/EligibilityDefinition/PropertySituation.svelte';
  import { formatYearMinusN } from '$lib/utils/formatters';

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
      La première étape du simulateur <span class="fr-text--bold">BoRiS</span>
      consiste à définir votre éligibilité au dispositif.
    </p>
    <p class="!mb-0">
      Pour cela, nous allons vous demander de renseigner les informatins
      suivantes :
    </p>
    <ol class="!mb-8">
      <li class="fr-text--bold">La composition de votre foyer</li>
      <li class="fr-text--bold">Vos revenus fiscaux</li>
      <li class="fr-text--bold">Votre situation immobilière</li>
    </ol>

    <Notice
      type="info"
      content={`Pensez à vous vous munir de votre avis d'imposition de l'année ${formatYearMinusN(1)}, concernant vos revenus de l'année ${formatYearMinusN(2)}, afin de renseigner vos revenus fiscaux.`}>
    </Notice>
  </Description>

  {#if currentPhase.phase === 1}
    <HouseholdComposition />
  {:else if currentPhase.phase === 2}
    <FiscalRevenues />
  {:else if currentPhase.phase === 3}
    <PropertySituation />
  {/if}
</Wrapper>
