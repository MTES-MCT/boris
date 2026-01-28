<script lang="ts">
  import acquisitionSimulatorManager from '$lib/managers/acquisition-simulator.svelte';

  import Wrapper from '$components/common/Simulator/Wrapper.svelte';
  import Description from '$components/common/Simulator/Description.svelte';
  import Form from '$components/common/Simulator/Form.svelte';
  import Actions from '$components/pages/simulateur-acquisition/Actions.svelte';
  import Action from '$components/pages/simulateur-acquisition/Action.svelte';
  import LissageSynthesis from './LissageSynthesis.svelte';
  import Highlight from '$components/common/Highlight.svelte';

  let {
    currentStep,
    steps,
    nextStep,
    previousStep,
    goToPreviousStep,
    goToNextStep,
  } = $derived(acquisitionSimulatorManager);

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    goToNextStep();
  };
</script>

<Wrapper>
  <Description
    title="Simulateur d'acquisition"
    stepTitle={`${currentStep.step}. ${currentStep.title}`}
    nextStepTitle={nextStep?.title}
    currentStep={currentStep.step}
    stepCount={steps.length}>
    <p>
      Le lissage de prêt permet de structurer vos emprunts (prêt immobilier
      classique et/ou prêt à taux zéro) avec des mensualités constantes sur
      plusieurs phases. Cette technique répartit le remboursement en adaptant la
      durée de chaque prêt selon votre situation financière, tout en maintenant
      des mensualités stables.
    </p>
    <a
      class="fr-link"
      href="https://www.anil.org/pret-taux-zero/"
      target="_blank"
      rel="noopener noreferrer">
      En savoir plus sur le prêt à taux zéro
    </a>
  </Description>
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
