<script lang="ts">
  import eligibilitySimulatorManager from '$lib/managers/eligibility-simulator.svelte';
  import Form from '$components/common/Simulator/Form.svelte';
  import Actions from '$components/common/Simulator/Actions.svelte';
  import Action from '$components/common/Simulator/Action.svelte';
  import { stepsContent } from '$lib/utils/eligibility-simulator';
  import Notice from '$components/common/Notice.svelte';
  import Alert from '$components/common/Alert.svelte';

  const {
    eligibility,
    currentPhase,
    nextPhase,
    goToNextPhase,
    previousStep,
    goToPreviousPhase,
    loading,
  } = $derived(eligibilitySimulatorManager);

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    goToNextPhase();
  };
</script>

<Form onSubmit={handleSubmit}>
  <fieldset class="fr-fieldset">
    <div class="fr-fieldset__element">
      <h3 class="fr-h4">{currentPhase?.title as string}</h3>
    </div>

    <div class="fr-fieldset__element fr-mb-4w">
      {#if eligibility?.eligibleZoneB2andC}
        {@render resultAlert(stepsContent.eligibility.zoneB2andC.title)}
        <p>{stepsContent.eligibility.zoneB2andC.content}</p>
      {:else if eligibility?.eligibleZoneB1}
        {@render resultAlert(stepsContent.eligibility.zoneB1.title)}
        <p>{stepsContent.eligibility.zoneB1.content}</p>
      {:else if eligibility?.eligibleZoneAandAbis}
        {@render resultAlert(stepsContent.eligibility.zoneAandAbis.title)}
        <p>{stepsContent.eligibility.zoneAandAbis.content}</p>
      {/if}
    </div>
  </fieldset>

  <Actions>
    <Action
      direction="previous"
      label={previousStep?.title as string}
      onClick={goToPreviousPhase}
      {loading} />
    <Action
      direction="next"
      label={nextPhase?.title as string}
      type="submit"
      {loading} />
  </Actions>
</Form>

{#snippet resultAlert(content: string)}
  <div class="!mb-4">
    <Alert type="success">
      <p class="fr-text--bold">{@html content}</p>
    </Alert>
  </div>
{/snippet}
