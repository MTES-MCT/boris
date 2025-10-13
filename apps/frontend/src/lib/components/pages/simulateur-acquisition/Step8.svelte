<script lang="ts">
  import { createPDF } from '$lib/utils/helpers';

  import Wrapper from '$components/pages/simulateur-acquisition/Wrapper.svelte';
  import Description from '$components/pages/simulateur-acquisition/Description.svelte';
  import Form from '$components/pages/simulateur-acquisition/Form.svelte';
  import Actions from '$components/pages/simulateur-acquisition/Actions.svelte';
  import Action from '$components/pages/simulateur-acquisition/Action.svelte';
  import GlobalSynthesis from '$components/pages/simulateur-acquisition/GlobalSynthesis.svelte';

  import acquisitionSimulatorManager from '$lib/managers/acquisition-simulator.svelte';

  let { previousStep, goToPreviousStep } = $derived(
    acquisitionSimulatorManager,
  );

  let printableRef = $state<HTMLElement | undefined>();

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    createPDF(printableRef as HTMLElement, 'recapitulatif-simulation.pdf');
  };
</script>

<Wrapper>
  <Description>
    <p>
      Voici le résumé de lasimulation de votre projet d'acquisition en bail réel
      solidaire (BRS). Les montants et calculs présentés ci-dessous sont des
      estimations basées sur les informations que vous avez renseignées et ne
      constituent pas une offre ferme de financement. Cette simulation est
      fournie à titre informatif uniquement. Les conditions réelles de
      financement peuvent différer selon votre situation personnelle et les
      critères d'octroi des organismes prêteurs.
    </p>
  </Description>
  <Form onSubmit={handleSubmit}>
    <div class="fieldset-container">
      <fieldset class="fr-fieldset">
        <div
          class="fr-fieldset__element"
          bind:this={printableRef}>
          <GlobalSynthesis />
        </div>
      </fieldset>
    </div>

    <Actions>
      <Action
        direction="previous"
        label={previousStep?.title as string}
        onClick={goToPreviousStep} />
      <Action
        label="Télécharger le récapitulatif"
        type="submit" />
    </Actions>
  </Form>
</Wrapper>
