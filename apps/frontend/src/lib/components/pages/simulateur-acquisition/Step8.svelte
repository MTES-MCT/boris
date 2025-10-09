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
  <Description
    content="[TEXTE A DEFINIR] Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." />
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
