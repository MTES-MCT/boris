<script lang="ts">
  import z, { ZodError } from 'zod';

  import type { FormFieldError } from '$lib/utils/definitions';
  import { formatFormErrors } from '$lib/utils/helpers';

  import Form from '$components/common/Simulator/Form.svelte';
  import Input from '$components/common/Input.svelte';
  import Actions from '$components/pages/simulateur-acquisition/Actions.svelte';
  import Action from '$components/pages/simulateur-acquisition/Action.svelte';
  import Wrapper from '$components/common/Simulator/Wrapper.svelte';
  import Description from '$components/common/Simulator/Description.svelte';

  import acquisitionSimulatorManager from '$lib/managers/acquisition-simulator.svelte';

  let {
    currentStep,
    steps,
    ownContribution,
    nextStep,
    previousStep,
    loading,
    acquisitionSimulation,
    updateAcquisitionSimulation,
    goToPreviousStep,
  } = $derived(acquisitionSimulatorManager);

  let errors: FormFieldError = $state({});

  const FormData = z.object({
    ownContribution: z
      .number()
      .gte(0, 'Veuillez saisir un chiffre supérieur à 0.')
      .optional(),
  });

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    const payload = {
      ownContribution: acquisitionSimulatorManager.ownContribution
        ? acquisitionSimulatorManager.ownContribution
        : 0,
    };

    try {
      FormData.parse(payload);
      errors = {};

      if (acquisitionSimulation) {
        await updateAcquisitionSimulation(payload);
      }
    } catch (e) {
      errors = formatFormErrors((e as ZodError).issues);
    }
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
      Renseignez le montant de votre apport personnel. Cette somme vous
      permettra de financer une partie du coût de votre projet et de réduire le
      montant de l'emprunt.
    </p>
  </Description>
  <Form onSubmit={handleSubmit}>
    <div class="fieldset-container">
      <fieldset class="fr-fieldset">
        <div class="fr-fieldset__element">
          <Input
            value={ownContribution}
            label="Montant de votre apport (€)"
            labelTooltip="Somme dont vous disposez pour le projet (épargne, donation,
                aide familiale, etc.)."
            id="own-contribution"
            hint="Laissez le champs vide si vous n'avez pas d'apport"
            error={errors.ownContribution}
            type="number"
            placeholder="Exemple: 10 000€"
            onChange={(e) => {
              acquisitionSimulatorManager.ownContribution = Number(
                (e.target as HTMLInputElement).value,
              );
            }} />
        </div>
      </fieldset>
    </div>

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
