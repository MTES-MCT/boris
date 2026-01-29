<script lang="ts">
  import Action from '$components/common/Simulator/Action.svelte';
  import Actions from '$components/common/Simulator/Actions.svelte';
  import Description from '$components/common/Simulator/Description.svelte';
  import Form from '$components/common/Simulator/Form.svelte';
  import Wrapper from '$components/common/Simulator/Wrapper.svelte';

  import eligibilitySimulatorManager from '$lib/managers/eligibility-simulator.svelte';

  const {
    currentStep,
    steps,
    previousStep,
    nextStep,
    loading,
    goToNextStep,
    goToPreviousStep,
  } = $derived(eligibilitySimulatorManager);

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    goToNextStep();
  };
</script>

<Wrapper>
  <Description
    title="Simulateur d'éligibilité"
    stepTitle={`${currentStep.step}. ${currentStep.title}`}
    currentStep={currentStep.step}
    stepCount={steps.length}>
    <p>Step 2 description</p>
  </Description>
  <Form onSubmit={handleSubmit}>
    <p>Step 2 content</p>

    <Actions>
      <Action
        direction="previous"
        label={previousStep?.title as string}
        onClick={goToPreviousStep}
        {loading} />
      <Action
        direction="next"
        label={nextStep?.title as string}
        type="submit"
        {loading} />
    </Actions>
  </Form>
</Wrapper>
