<script lang="ts">
  import acquisitionSimulatorManager from '$lib/managers/acquisition-simulator.svelte';

  import Wrapper from '$components/pages/simulateur-acquisition/Wrapper.svelte';
  import Description from '$components/pages/simulateur-acquisition/Description.svelte';
  import Form from '$components/pages/simulateur-acquisition/Form.svelte';
  import Actions from '$components/pages/simulateur-acquisition/Actions.svelte';
  import Action from '$components/pages/simulateur-acquisition/Action.svelte';
  import Notice from '$components/common/Notice.svelte';
  import LissageSynthesis from './LissageSynthesis.svelte';
  import Callout from '$components/common/Callout.svelte';

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
        <div class="fr-fieldset__element fr-mb-4w">
          <LissageSynthesis />
        </div>

        <div class="fr-fieldset__element">
          <Notice
            content="Vous pourrez télécharger la simulation du lissage des prêts à la fin du parcours." />

          <Callout
            title="Titre"
            text="D'après les informations que vous nous avez fournies, vous n'êtes pas éligible au PTZ."
            accent="brown-opera"
            hasIcon
            icon="information-fill"
            hasButton
            buttonLabel="Voir les détails"
            onClick={() => {
              console.log('coucou');
            }} />
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
