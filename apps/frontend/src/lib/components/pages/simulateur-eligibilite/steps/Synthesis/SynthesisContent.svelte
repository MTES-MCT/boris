<script lang="ts">
  import eligibilitySimulatorManager from '$lib/managers/eligibility-simulator.svelte';
  import Form from '$components/common/Simulator/Form.svelte';
  import Actions from '$components/common/Simulator/Actions.svelte';
  import Action from '$components/common/Simulator/Action.svelte';

  const { currentPhase, previousStep, goToPreviousPhase, loading } = $derived(
    eligibilitySimulatorManager,
  );

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
  };
</script>

<Form onSubmit={handleSubmit}>
  <fieldset class="fr-fieldset">
    <div class="fr-fieldset__element">
      <h3 class="fr-h4">{currentPhase?.title as string}</h3>
    </div>
  </fieldset>

  <Actions>
    <Action
      direction="previous"
      label={previousStep?.title as string}
      onClick={goToPreviousPhase}
      {loading} />
  </Actions>
</Form>
