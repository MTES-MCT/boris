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
    propertySituation,
    currentPhase,
    nextPhase,
    goToNextPhase,
    previousStep,
    goToPreviousPhase,
    refuseConnection,
    loading,
  } = $derived(eligibilitySimulatorManager);

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    goToNextPhase();
  };

  $inspect(eligibility);
</script>

<Form onSubmit={handleSubmit}>
  <fieldset class="fr-fieldset">
    <div class="fr-fieldset__element">
      <h3 class="fr-h4">{currentPhase?.title as string}</h3>
    </div>

    <div class="fr-fieldset__element fr-mb-4w">
      {#if propertySituation === 'PROPRIETAIRE'}
        {@render resultAlert(stepsContent.eligibility.isOwner.title, 'error')}
        <p>{stepsContent.eligibility.isOwner.content}</p>
        {@render connectionCta()}
      {:else if eligibility?.eligibleZoneB2andC}
        {@render resultAlert(stepsContent.eligibility.zoneB2andC.title)}
        <p>{stepsContent.eligibility.zoneB2andC.content}</p>
        {@render connectionCta()}
      {:else if eligibility?.eligibleZoneB1}
        {@render resultAlert(stepsContent.eligibility.zoneB1.title)}
        <p>{stepsContent.eligibility.zoneB1.content}</p>
        {@render connectionCta()}
      {:else if eligibility?.eligibleZoneAandAbis}
        {@render resultAlert(stepsContent.eligibility.zoneAandAbis.title)}
        <p>{stepsContent.eligibility.zoneAandAbis.content}</p>
        {@render connectionCta()}
      {:else}
        {@render resultAlert(
          stepsContent.eligibility.notEligible.title,
          'error',
        )}
        <p>{stepsContent.eligibility.notEligible.content}</p>
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

{#snippet resultAlert(content: string, type: 'success' | 'error' = 'success')}
  <div class="!mb-4">
    <Alert {type}>
      <p
        class="fr-text--bold"
        data-testid="eligibility-result-text">
        {@html content}
      </p>
    </Alert>
  </div>
{/snippet}

{#snippet connectionCta()}
  <div class="fr-fieldset__element">
    <div class="separator !mb-8"></div>
    <h4 class="fr-h5">{stepsContent.connection.title}</h4>
    <p>
      {stepsContent.connection.connectionCtaText}
    </p>
    <p class="!mb-0">
      {stepsContent.exitSimulatorText}
      <button
        type="button"
        class="fr-link !inline underline"
        data-testid="refuse-connection-link"
        onclick={refuseConnection}>
        ici
      </button>
      .
    </p>
  </div>
{/snippet}
