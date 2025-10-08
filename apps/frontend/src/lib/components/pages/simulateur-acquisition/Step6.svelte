<script lang="ts">
  import acquisitionSimulatorManager from '$lib/managers/acquisition-simulator.svelte';

  import Wrapper from '$components/pages/simulateur-acquisition/Wrapper.svelte';
  import Description from '$components/pages/simulateur-acquisition/Description.svelte';
  import Form from '$components/pages/simulateur-acquisition/Form.svelte';
  import Actions from '$components/pages/simulateur-acquisition/Actions.svelte';
  import Action from '$components/pages/simulateur-acquisition/Action.svelte';
  import LissageSynthesis from './LissageSynthesis.svelte';
  import Highlight from '$components/common/Highlight.svelte';

  let { nextStep, previousStep, goToPreviousStep, goToNextStep } = $derived(
    acquisitionSimulatorManager,
  );

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    // goToNextStep();
  };
</script>

<Wrapper>
  <Description
    content="[TEXTE A DEFINIR] Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." />
  <Form onSubmit={handleSubmit}>
    <div class="fieldset-container">
      <fieldset class="fr-fieldset">
        <div class="fr-fieldset__element">
          <LissageSynthesis />
        </div>
      </fieldset>

      <fieldset class="fr-fieldset">
        <div class="fr-fieldset__element">
          <Highlight
            text="Vous pourrez télécharger la simulation du lissage des prêts à la fin du parcours."
            accent="green-archipel"
            icon="download-line"
            size="sm"
            fontWeight="bold" />
        </div>
      </fieldset>
    </div>

    <Actions>
      <Action
        direction="previous"
        label={previousStep?.title as string}
        onClick={goToPreviousStep} />
      <Action
        direction="next"
        label={nextStep?.title as string}
        type="submit" />
    </Actions>
  </Form>
</Wrapper>
