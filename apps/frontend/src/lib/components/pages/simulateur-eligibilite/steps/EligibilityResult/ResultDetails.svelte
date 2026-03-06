<script lang="ts">
  import { onMount } from 'svelte';

  import Form from '$components/common/Simulator/Form.svelte';
  import Actions from '$components/common/Simulator/Actions.svelte';
  import Action from '$components/common/Simulator/Action.svelte';
  import EligibilityDetail from '$components/pages/simulateur-eligibilite/steps/EligibilityResult/EligibilityDetail.svelte';

  import eligibilitySimulatorManager from '$lib/managers/eligibility-simulator.svelte';
  import cookieConsentManager from '$lib/managers/consent.svelte';

  let isIneligible = $derived(
    eligibilitySimulatorManager.eligibility?.eligibleZoneB2andC === false &&
      eligibilitySimulatorManager.eligibility?.eligibleZoneB1 === false &&
      eligibilitySimulatorManager.eligibility?.eligibleZoneAandAbis === false,
  );

  onMount(() => {
    eligibilitySimulatorManager.hasRefusedConnection = false;

    if (cookieConsentManager.hasUserConsented) {
      if (eligibilitySimulatorManager.eligibility?.eligibleZoneB2andC) {
        // @ts-expect-error - gtag is not defined in the global scope
        window.gtag('event', 'Éligible partout en France');
      } else if (eligibilitySimulatorManager.eligibility?.eligibleZoneB1) {
        // @ts-expect-error - gtag is not defined in the global scope
        window.gtag('event', 'Éligible  zone A, Abis et B1');
      } else if (
        eligibilitySimulatorManager.eligibility?.eligibleZoneAandAbis
      ) {
        // @ts-expect-error - gtag is not defined in the global scope
        window.gtag('event', 'Éligible A et Abis');
      }
    }
  });

  const {
    currentPhase,
    nextPhase,
    updateEligibilitySimulation,
    previousStep,
    goToPreviousPhase,
    loading,
  } = $derived(eligibilitySimulatorManager);

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    updateEligibilitySimulation({
      hasRefusedConnection: false,
    });
  };
</script>

<Form onSubmit={handleSubmit}>
  <fieldset class="fr-fieldset">
    <div class="fr-fieldset__element">
      <h3 class="fr-h4">{currentPhase?.title as string}</h3>
    </div>

    <EligibilityDetail />
  </fieldset>

  <Actions>
    <Action
      direction="previous"
      label={previousStep?.title as string}
      onClick={goToPreviousPhase}
      {loading} />
    <Action
      direction="next"
      disabled={isIneligible}
      label={nextPhase?.title as string}
      type="submit"
      {loading} />
  </Actions>
</Form>
