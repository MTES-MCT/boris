<script lang="ts">
  import Wrapper from '$components/pages/simulateur-acquisition/Wrapper.svelte';
  import Description from '$components/pages/simulateur-acquisition/Description.svelte';
  import Form from '$components/pages/simulateur-acquisition/Form.svelte';
  import Actions from '$components/pages/simulateur-acquisition/Actions.svelte';
  import Action from '$components/pages/simulateur-acquisition/Action.svelte';
  import OperationSynthesis from './OperationSynthesis.svelte';
  import Highlight from '$components/common/Highlight.svelte';

  import acquisitionSimulatorManager from '$lib/managers/acquisition-simulator.svelte';

  let { nextStep, previousStep, goToPreviousStep, goToNextStep } = $derived(
    acquisitionSimulatorManager,
  );

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    goToNextStep();
  };
</script>

<Wrapper>
  <Description>
    <p>
      Voici un premier récapitulatif de votre apport, du prix du logement et de
      tous les frais annexes. Cette synthèse vous aide à visualiser le budget
      global nécessaire et le montant exact à emprunter pour finaliser votre
      projet.
    </p>
  </Description>
  <Form onSubmit={handleSubmit}>
    <div class="fieldset-container">
      <fieldset class="fr-fieldset">
        <div class="fr-fieldset__element fr-mb-4w">
          <OperationSynthesis />
        </div>
      </fieldset>

      <fieldset class="fr-fieldset">
        <div class="fr-fieldset__element">
          <Highlight
            text="Vous pourrez télécharger la synthèse de votre simulation à la fin du parcours."
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
