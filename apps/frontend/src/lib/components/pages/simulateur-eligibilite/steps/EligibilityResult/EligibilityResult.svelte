<script lang="ts">
  import Description from '$components/common/Simulator/Description.svelte';
  import Wrapper from '$components/common/Simulator/Wrapper.svelte';

  import eligibilitySimulatorManager from '$lib/managers/eligibility-simulator.svelte';
  import ResultDetail from '$components/pages/simulateur-eligibilite/steps/EligibilityResult/ResultDetails.svelte';
  import UserDetails from '$components/pages/simulateur-eligibilite/steps/EligibilityResult/UserDetails.svelte';

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
      La deuxième étape du simulateur <span class="fr-text--bold">BoRiS</span>
      consiste à présenter votre résultat d'éligibilité, et, si vous le souhaitez,
      à vous mettre en relation avec les professionnels du Bail Réel Solidaire.
    </p>
    <ol class="!mb-8">
      <li class="fr-text--bold">{currentStep.phases[0].title}</li>
      <li class="fr-text--bold">{currentStep.phases[1].title}</li>
    </ol>
  </Description>

  {#if currentPhase.phase === 1}
    <ResultDetail />
  {:else if currentPhase.phase === 2}
    <UserDetails />
  {/if}
</Wrapper>
