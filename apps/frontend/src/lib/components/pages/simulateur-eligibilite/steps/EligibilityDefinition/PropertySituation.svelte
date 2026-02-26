<script lang="ts">
  import z, { ZodError } from 'zod';
  import type { FormFieldError } from '$lib/utils/definitions';
  import Form from '$components/common/Simulator/Form.svelte';
  import Actions from '$components/common/Simulator/Actions.svelte';
  import Action from '$components/common/Simulator/Action.svelte';
  import Select from '$components/common/Select.svelte';
  import eligibilitySimulatorManager from '$lib/managers/eligibility-simulator.svelte';
  import { formatFormErrors } from '$lib/utils/helpers';
  import {
    stepsContent,
    type PropertySituation,
  } from '$lib/utils/eligibility-simulator';

  let {
    eligibility,
    currentPhase,
    propertySituation,
    nextStep,
    updateEligibilitySimulation,
    previousPhase,
    goToPreviousPhase,
    loading,
  } = $derived(eligibilitySimulatorManager);

  let errors: FormFieldError = $state({});

  let FormData = z.object({
    propertySituation: z.enum(
      [
        'LOCATAIRE_SOCIAL',
        'LOCATAIRE_PRIVE',
        'PROPRIETAIRE',
        'HEBERGE',
        'AUTRE',
      ],
      {
        message: 'Veuillez sélectionner une option',
      },
    ),
  });

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    const payload = {
      propertySituation,
    };

    try {
      FormData.parse(payload);
      errors = {};

      updateEligibilitySimulation({
        propertySituation,
        eligibility,
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
      <Select
        label={stepsContent.propertySituation.label}
        required
        options={stepsContent.propertySituation.options.map((stepContent) => ({
          ...stepContent,
          selected: propertySituation === stepContent.value,
        }))}
        onChange={(e) => {
          const { value } = e.target as HTMLSelectElement;

          if (value) {
            delete errors.propertySituation;
          }

          eligibilitySimulatorManager.propertySituation =
            value === '' ? undefined : (value as PropertySituation);
        }}
        error={errors.propertySituation}
        errorDataTestId={stepsContent.propertySituation.errorDataTestId} />
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
      label={nextStep?.title as string}
      type="submit"
      {loading} />
  </Actions>
</Form>
