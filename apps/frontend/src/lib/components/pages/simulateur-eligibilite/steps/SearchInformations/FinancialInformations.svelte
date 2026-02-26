<script lang="ts">
  import eligibilitySimulatorManager from '$lib/managers/eligibility-simulator.svelte';
  import Form from '$components/common/Simulator/Form.svelte';
  import Actions from '$components/common/Simulator/Actions.svelte';
  import Action from '$components/common/Simulator/Action.svelte';
  import Input from '$components/common/Input.svelte';
  import { stepsContent } from '$lib/utils/eligibility-simulator';
  import {
    formattedThousandsToNumber,
    formatThousands,
  } from '$lib/utils/formatters';
  import type { FormFieldError } from '$lib/utils/definitions';
  import z, { ZodError } from 'zod';
  import { formatFormErrors } from '$lib/utils/helpers';

  const {
    formattedContribution,
    formattedResources,
    contribution,
    resources,
    currentPhase,
    nextPhase,
    updateEligibilitySimulation,
    previousPhase,
    goToPreviousPhase,
    loading,
  } = $derived(eligibilitySimulatorManager);

  let errors: FormFieldError = $state({});

  const FormData = z.object({
    formattedContribution: z
      .string(stepsContent.contribution.errorMessage)
      .refine((value) => {
        return formattedThousandsToNumber(value) > 0;
      }, stepsContent.contribution.errorMessage),
    formattedResources: z
      .string(stepsContent.resources.errorMessage)
      .refine((value) => {
        return formattedThousandsToNumber(value) > 0;
      }, stepsContent.resources.errorMessage),
  });

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    const payload = {
      formattedContribution,
      formattedResources,
    };

    try {
      FormData.parse(payload);
      errors = {};

      updateEligibilitySimulation({
        contribution,
        resources,
      });
    } catch (e) {
      errors = formatFormErrors((e as ZodError).issues);
    }
  };
</script>

<Form onSubmit={handleSubmit}>
  <fieldset class="fr-fieldset">
    <div class="fr-fieldset__element">
      <h3 class="fr-h4">{currentPhase?.title as string}</h3>
    </div>

    <div class="fr-fieldset__element fr-mb-4w">
      <Input
        value={formattedContribution}
        label={stepsContent.contribution.label}
        type="text"
        currency
        icon="euro-line"
        required
        skipHTML5Required
        id="contribution"
        step={1000}
        maxlength={7}
        placeholder="Exemple: 25 000€"
        onChange={(e) => {
          eligibilitySimulatorManager.formattedContribution = formatThousands(
            (e.target as HTMLInputElement).value,
          );
        }}
        dataTestId={stepsContent.contribution.inputDataTestId}
        error={errors.formattedContribution}
        errorDataTestId={stepsContent.contribution.errorDataTestId} />
    </div>

    <div class="fr-fieldset__element fr-mb-4w">
      <Input
        value={formattedResources}
        label={stepsContent.resources.label}
        type="text"
        currency
        icon="euro-line"
        required
        skipHTML5Required
        id="resources"
        step={1000}
        maxlength={7}
        placeholder="Exemple: 25 000€"
        onChange={(e) => {
          eligibilitySimulatorManager.formattedResources = formatThousands(
            (e.target as HTMLInputElement).value,
          );
        }}
        dataTestId={stepsContent.resources.inputDataTestId}
        error={errors.formattedResources}
        errorDataTestId={stepsContent.resources.errorDataTestId} />
    </div>
  </fieldset>

  <Actions>
    <Action
      direction="previous"
      label={previousPhase?.title as string}
      onClick={goToPreviousPhase}
      {loading} />
    <Action
      direction="next"
      label={nextPhase?.title as string}
      type="submit"
      {loading} />
  </Actions>
</Form>
