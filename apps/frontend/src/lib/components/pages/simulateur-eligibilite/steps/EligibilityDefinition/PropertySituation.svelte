<script lang="ts">
  import z, { ZodError } from 'zod';
  import type { FormFieldError } from '$lib/utils/definitions';
  import Form from '$components/common/Simulator/Form.svelte';
  import Actions from '$components/common/Simulator/Actions.svelte';
  import Action from '$components/common/Simulator/Action.svelte';
  import Select from '$components/common/Select.svelte';
  import eligibilitySimulatorManager, {
    type PropertySituation,
  } from '$lib/managers/eligibility-simulator.svelte';
  import { formatFormErrors } from '$lib/utils/helpers';

  const {
    currentPhase,
    propertySituation,
    nextStep,
    goToNextPhase,
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

      eligibilitySimulatorManager.propertySituation = propertySituation;

      goToNextPhase();
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
        label="Quelle est votre situation immobilière ?"
        required
        options={[
          {
            value: undefined,
            label: 'Veuillez sélectionner une option',
            selected: propertySituation === undefined,
          },
          {
            value: 'LOCATAIRE_SOCIAL',
            label: "Locataire d'un logement social",
            selected: propertySituation === 'LOCATAIRE_SOCIAL',
          },
          {
            value: 'LOCATAIRE_PRIVE',
            label: "Locataire d'un logement privé",
            selected: propertySituation === 'LOCATAIRE_PRIVE',
          },
          {
            value: 'PROPRIETAIRE',
            label: "Propriétaire d'un logement",
            selected: propertySituation === 'PROPRIETAIRE',
          },
          {
            value: 'HEBERGE',
            label: 'Hébergé-e',
            selected: propertySituation === 'HEBERGE',
          },
          {
            value: 'AUTRE',
            label: 'Dans une autre situation immobilière',
            selected: propertySituation === 'AUTRE',
          },
        ]}
        onChange={(e) => {
          const { value } = e.target as HTMLSelectElement;

          eligibilitySimulatorManager.propertySituation =
            value as PropertySituation;
        }}
        error={errors.propertySituation}
        errorDataTestId="select-property-situation-error-message" />
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
