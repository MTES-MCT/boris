<script lang="ts">
  import Action from '$components/common/Simulator/Action.svelte';
  import Actions from '$components/common/Simulator/Actions.svelte';
  import Description from '$components/common/Simulator/Description.svelte';
  import Form from '$components/common/Simulator/Form.svelte';
  import Wrapper from '$components/common/Simulator/Wrapper.svelte';

  import eligibilitySimulatorManager from '$lib/managers/eligibility-simulator.svelte';

  const { currentStep, steps, previousStep, goToPreviousStep } = $derived(
    eligibilitySimulatorManager,
  );
</script>

<Wrapper>
  <Description
    title="Simulateur d'éligibilité"
    stepTitle={`${currentStep.step}. ${currentStep.title}`}
    currentStep={currentStep.step}
    stepCount={steps.length}>
    <p>Step 3 description</p>
  </Description>
  <Form
    onSubmit={() => {
      console.log('submit');
    }}>
    <p>Step 3 content</p>

    <Actions>
      <Action
        direction="previous"
        label={previousStep?.title as string}
        onClick={goToPreviousStep} />
    </Actions>
  </Form>
</Wrapper>
